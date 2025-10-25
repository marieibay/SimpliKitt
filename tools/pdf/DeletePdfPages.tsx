import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import FileUpload from '../../components/FileUpload';
import { trackEvent, trackGtagEvent } from '../../analytics';
import { LoaderIcon, InfoIcon, Trash2Icon, CheckIcon } from '../../components/Icons';

const PDFJS_VERSION = "4.3.136";
const PDFJS_URL = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.min.mjs`;
const PDFJS_WORKER_URL = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.mjs`;

const DeletePdfPages: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [totalPages, setTotalPages] = useState(0);
  const [thumbnails, setThumbnails] = useState<{ pageNum: number, dataUrl: string }[]>([]);
  const [previews, setPreviews] = useState<Record<number, string>>({});
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());

  const [activePreviewUrl, setActivePreviewUrl] = useState<string | null>(null);
  const [activePreviewPageNum, setActivePreviewPageNum] = useState<number | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const [isLibraryReady, setIsLibraryReady] = useState(false);
  const [libraryError, setLibraryError] = useState<string | null>(null);
  const pdfjsLibRef = useRef<any>(null);
  const pdfDocRef = useRef<any>(null);

  useEffect(() => {
    const loadLibrary = async () => {
      try {
        const pdfjsModule = await import(/* @vite-ignore */ PDFJS_URL);
        const pdfjsLib = pdfjsModule.default || pdfjsModule;
        if (!pdfjsLib || !pdfjsLib.getDocument) {
          throw new Error("PDF library loaded but is not in the expected format.");
        }
        pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
        pdfjsLibRef.current = pdfjsLib;
        setIsLibraryReady(true);
      } catch (err) {
        console.error(err);
        setLibraryError("PDF viewer library failed to load. Please check your internet connection and refresh.");
      }
    };
    loadLibrary();
  }, []);

  const renderAndCachePageAsPreview = useCallback(async (pdfDoc: any, pageNum: number) => {
    if (previews[pageNum]) {
        setActivePreviewUrl(previews[pageNum]);
        setActivePreviewPageNum(pageNum);
        return;
    }

    setIsPreviewLoading(true);
    try {
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) throw new Error("Could not get canvas context");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: context, viewport }).promise;
        const dataUrl = canvas.toDataURL('image/jpeg');
        setPreviews(p => ({ ...p, [pageNum]: dataUrl }));
        setActivePreviewUrl(dataUrl);
        setActivePreviewPageNum(pageNum);
    } catch(err) {
        console.error(err);
        setError(`Failed to render page ${pageNum}. The PDF might be corrupted.`);
    } finally {
        setIsPreviewLoading(false);
    }
}, [previews]);

  const handleFile = useCallback(async (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setIsProcessingFile(true);
    
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const loadingTask = pdfjsLibRef.current.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      pdfDocRef.current = pdf;
      setTotalPages(pdf.numPages);

      const thumbs: { pageNum: number, dataUrl: string }[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.3 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if(!context) continue;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: context, viewport }).promise;
        thumbs.push({ pageNum: i, dataUrl: canvas.toDataURL('image/jpeg', 0.8) });
      }
      setThumbnails(thumbs);
      
      if (pdf.numPages > 0) {
        await renderAndCachePageAsPreview(pdf, 1);
      }

    } catch (err) {
      console.error(err);
      setError("Could not read the PDF. It might be corrupted or encrypted.");
      handleReset();
    } finally {
      setIsProcessingFile(false);
    }
  }, [renderAndCachePageAsPreview]);

  const handleThumbnailClick = async (pageNum: number) => {
    if (pdfDocRef.current) {
        renderAndCachePageAsPreview(pdfDocRef.current, pageNum);
    }
    const newSelectedPages = new Set(selectedPages);
    if (newSelectedPages.has(pageNum)) {
        newSelectedPages.delete(pageNum);
    } else {
        newSelectedPages.add(pageNum);
    }
    setSelectedPages(newSelectedPages);
  };
  
  const handleSelectAll = () => {
    const allPages = new Set(Array.from({ length: totalPages }, (_, i) => i + 1));
    setSelectedPages(allPages);
  };

  const handleDeselectAll = () => {
    setSelectedPages(new Set());
  };


  const handleDelete = async () => {
    if (!file || selectedPages.size === 0) {
      setError("No pages selected for deletion.");
      return;
    }
    if (selectedPages.size >= totalPages) {
        setError("You cannot delete all pages of the document.");
        return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      // FIX: Explicitly type `p` as a number to resolve TS error.
      const indicesToDelete = Array.from(selectedPages).map((p: number) => p - 1);
      
      const arrayBuffer = await file.arrayBuffer();
      const originalPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      
      const pageIndicesToKeep = Array.from({ length: totalPages }, (_, i) => i).filter(i => !indicesToDelete.includes(i));

      // This is faster than removing pages one by one
      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(originalPdf, pageIndicesToKeep);
      copiedPages.forEach(page => newPdf.addPage(page));
      
      const newPdfBytes = await newPdf.save();
      const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `deleted-${file.name}`;
      link.click();
      URL.revokeObjectURL(link.href);

      trackEvent('pdf_pages_deleted', { deletedPageCount: selectedPages.size });
      trackGtagEvent('tool_used', {
        event_category: 'PDF & Document Tools',
        event_label: 'Delete Pages from PDF',
        tool_name: 'delete-pages-from-pdf',
        is_download: true,
        deleted_pages: selectedPages.size,
      });
      
      // Reset after successful deletion
      handleReset();

    } catch (err) {
      setError("An error occurred while deleting pages.");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setTotalPages(0);
    setThumbnails([]);
    setPreviews({});
    setSelectedPages(new Set());
    setActivePreviewUrl(null);
    setActivePreviewPageNum(null);
    pdfDocRef.current = null;
  };
  
  if (!isLibraryReady) {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-50 p-6 rounded-lg border min-h-[300px]">
         {libraryError ? (
              <>
                  <InfoIcon className="w-12 h-12 text-red-500 mb-4" />
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Library Error</h2>
                  <p className="text-red-600 text-center">{libraryError}</p>
              </>
         ) : (
              <>
                  <LoaderIcon className="w-12 h-12 text-blue-600 animate-spin mb-6" />
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Initializing PDF Viewer...</h2>
              </>
         )}
      </div>
    )
  }

  if (!file) {
      return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['application/pdf']} title="Upload a PDF to view and delete pages" externalError={error} />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 flex flex-col border rounded-lg bg-white shadow-sm max-h-[80vh]">
            <div className="flex items-center justify-between p-2 border-b bg-gray-50 rounded-t-lg">
                <div className="flex items-center gap-2">
                    <button onClick={handleSelectAll} className="px-2 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-100 rounded">Select All</button>
                    <button onClick={handleDeselectAll} className="px-2 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-200 rounded">Deselect All</button>
                </div>
                <button onClick={handleDelete} disabled={isDeleting || selectedPages.size === 0} className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed">
                    {isDeleting ? <LoaderIcon className="w-4 h-4 animate-spin" /> : <Trash2Icon className="w-4 h-4" />}
                    Delete ({selectedPages.size})
                </button>
            </div>

            {isProcessingFile ? (
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <LoaderIcon className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                        <p className="mt-2 text-sm text-gray-600">Generating thumbnails...</p>
                    </div>
                </div>
            ) : (
                <div className="overflow-y-auto flex-grow p-2 bg-gray-100">
                    <div className="grid grid-cols-3 gap-2">
                        {thumbnails.map(thumb => (
                            <div
                                key={thumb.pageNum}
                                onClick={() => handleThumbnailClick(thumb.pageNum)}
                                className={`relative border-2 rounded-md cursor-pointer transition-all duration-150 group ${selectedPages.has(thumb.pageNum) ? 'border-blue-500' : 'border-transparent hover:border-blue-300'}`}
                            >
                                <img src={thumb.dataUrl} alt={`Page ${thumb.pageNum}`} className="w-full h-auto bg-white shadow-sm rounded-sm" />
                                <p className="text-center text-xs text-gray-600 py-1 bg-white bg-opacity-70 rounded-b-sm">{thumb.pageNum}</p>
                                {selectedPages.has(thumb.pageNum) && (
                                    <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center pointer-events-none">
                                        <CheckIcon className="w-3 h-3" strokeWidth={3} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

        <div className="lg:col-span-2 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Page Preview {activePreviewPageNum && `(${activePreviewPageNum} / ${totalPages})`}</h3>
            <div className="flex-grow flex items-center justify-center p-2 border rounded-lg bg-gray-200 min-h-[400px] lg:min-h-0">
                {isPreviewLoading ? (
                     <LoaderIcon className="w-10 h-10 text-blue-600 animate-spin" />
                ) : activePreviewUrl ? (
                    <img src={activePreviewUrl} alt={`Preview of page ${activePreviewPageNum}`} className="max-w-full max-h-full object-contain shadow-lg" />
                ) : (
                    <p className="text-gray-500">Select a page to preview</p>
                )}
            </div>
             <button onClick={handleReset} className="mt-4 text-sm text-blue-600 hover:underline text-center">
                Start Over
            </button>
        </div>
    </div>
  );
};

export default DeletePdfPages;
