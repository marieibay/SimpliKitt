import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import { trackEvent, trackGtagEvent } from '../../analytics';
import { LoaderIcon, InfoIcon, LayersIcon, CloseIcon, UploadIcon, PlusIcon, CheckIcon } from '../../components/Icons';

const PDFJS_VERSION = "4.3.136";
const PDFJS_URL = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.min.mjs`;
const PDFJS_WORKER_URL = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.mjs`;

interface PageInfo {
  id: string;
  docIndex: number;
  originalPageIndex: number;
  thumbnailDataUrl: string;
  fileName: string;
  file: File;
}

const MergePdf: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [activePreviewUrl, setActivePreviewUrl] = useState<string | null>(null);
  const [activePreviewId, setActivePreviewId] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  
  const [isAddPagesModalOpen, setIsAddPagesModalOpen] = useState(false);
  const [modalPdfProcessing, setModalPdfProcessing] = useState(false);
  const [modalPdfThumbnails, setModalPdfThumbnails] = useState<{ pageNum: number, dataUrl: string, file: File, originalPageIndex: number }[]>([]);
  const [selectedModalPages, setSelectedModalPages] = useState<Set<number>>(new Set());

  const [modalPreviews, setModalPreviews] = useState<Record<number, string>>({});
  const [activeModalPreviewUrl, setActiveModalPreviewUrl] = useState<string | null>(null);
  const [activeModalPreviewPageNum, setActiveModalPreviewPageNum] = useState<number | null>(null);
  const [isModalPreviewLoading, setIsModalPreviewLoading] = useState(false);
  const modalPdfDocRef = useRef<any>(null);


  const [isLibraryReady, setIsLibraryReady] = useState(false);
  const [libraryError, setLibraryError] = useState<string | null>(null);
  
  const pdfjsLibRef = useRef<any>(null);
  const pdfjsDocsRef = useRef<Map<number, any>>(new Map());
  const dragItem = useRef<number | undefined>(undefined);
  const dragOverItem = useRef<number | undefined>(undefined);

  useEffect(() => {
    const loadLibrary = async () => {
      try {
        const pdfjsModule = await import(/* @vite-ignore */ PDFJS_URL);
        const pdfjsLib = pdfjsModule.default || pdfjsModule;
        pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
        pdfjsLibRef.current = pdfjsLib;
        setIsLibraryReady(true);
      } catch (err) {
        console.error(err);
        setLibraryError("PDF viewer library failed to load. Please refresh.");
      }
    };
    loadLibrary();
  }, []);

  const renderAndCachePageAsPreview = useCallback(async (page: PageInfo) => {
    if (previews[page.id]) {
      setActivePreviewUrl(previews[page.id]);
      setActivePreviewId(page.id);
      return;
    }

    setIsPreviewLoading(true);
    try {
        const pdfDoc = pdfjsDocsRef.current.get(page.docIndex);
        if (!pdfDoc) throw new Error("PDF document not found in cache.");

        const pdfPage = await pdfDoc.getPage(page.originalPageIndex + 1);
        const viewport = pdfPage.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) throw new Error("Could not get canvas context");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await pdfPage.render({ canvasContext: context, viewport }).promise;
        const dataUrl = canvas.toDataURL('image/jpeg');
        
        setPreviews(p => ({ ...p, [page.id]: dataUrl }));
        setActivePreviewUrl(dataUrl);
        setActivePreviewId(page.id);
    } catch(err) {
        console.error(err);
        setError(`Failed to render page preview. The PDF might be corrupted.`);
    } finally {
        setIsPreviewLoading(false);
    }
  }, [previews]);

  const renderModalPagePreview = useCallback(async (pageNum: number) => {
    if (modalPreviews[pageNum]) {
      setActiveModalPreviewUrl(modalPreviews[pageNum]);
      setActiveModalPreviewPageNum(pageNum);
      return;
    }
    
    if (!modalPdfDocRef.current) return;

    setIsModalPreviewLoading(true);
    try {
        const pdfPage = await modalPdfDocRef.current.getPage(pageNum);
        const viewport = pdfPage.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) throw new Error("Could not get canvas context");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await pdfPage.render({ canvasContext: context, viewport }).promise;
        const dataUrl = canvas.toDataURL('image/jpeg');
        
        setModalPreviews(p => ({ ...p, [pageNum]: dataUrl }));
        setActiveModalPreviewUrl(dataUrl);
        setActiveModalPreviewPageNum(pageNum);
    } catch(err) {
        console.error(err);
        setError(`Failed to render modal page preview. The PDF might be corrupted.`);
    } finally {
        setIsModalPreviewLoading(false);
    }
}, [modalPreviews]);
  
  const processAndAddFiles = async (acceptedFiles: File[], isModal: boolean = false) => {
    setError(null);
    if(isModal) {
        setModalPdfProcessing(true);
    } else {
        setIsProcessingFiles(true);
    }
    
    try {
      const newPages: PageInfo[] = [];
      const docIndexOffset = files.length;

      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];
        const docIndex = docIndexOffset + i;
        const arrayBuffer = await file.arrayBuffer();
        
        const loadingTask = pdfjsLibRef.current.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        
        if (isModal) {
            modalPdfDocRef.current = pdf;
        } else {
            pdfjsDocsRef.current.set(docIndex, pdf);
        }

        const thumbs: { pageNum: number, dataUrl: string, file: File, originalPageIndex: number }[] = [];

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 0.4 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            if (!context) continue;
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            await page.render({ canvasContext: context, viewport }).promise;
            
            const pageData = {
                pageNum: pageNum,
                dataUrl: canvas.toDataURL('image/jpeg'),
                file: file,
                originalPageIndex: pageNum - 1
            };

            if (isModal) {
                thumbs.push(pageData);
            } else {
                const pageId = `doc-${docIndex}-page-${pageNum-1}`;
                 newPages.push({ 
                    id: pageId,
                    docIndex,
                    originalPageIndex: pageNum - 1,
                    thumbnailDataUrl: pageData.dataUrl,
                    fileName: file.name,
                    file: file
                });
            }
        }
        if (isModal) {
            setModalPdfThumbnails(thumbs);
            setIsAddPagesModalOpen(true);
            if(thumbs.length > 0) {
                renderModalPagePreview(thumbs[0].pageNum);
            }
        }
      }
      
      if (!isModal) {
        setPages(p => [...p, ...newPages]);
        setFiles(f => [...f, ...acceptedFiles]);
        if (pages.length === 0 && newPages.length > 0) {
            renderAndCachePageAsPreview(newPages[0]);
        }
      }

    } catch (err) {
      console.error(err);
      setError("Could not read one or more PDFs. They may be corrupted or encrypted.");
    } finally {
        if(isModal) {
            setModalPdfProcessing(false);
        } else {
            setIsProcessingFiles(false);
        }
    }
  }


  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    processAndAddFiles(acceptedFiles, false);
  }, [files, pages, renderAndCachePageAsPreview]);
  
  const onDropModal = useCallback(async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        processAndAddFiles(acceptedFiles.slice(0, 1), true); // Only process the first file for modal
      }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] }
  });
  
  const { getRootProps: getModalRootProps, getInputProps: getModalInputProps, open: openModalFileDialog } = useDropzone({
    onDrop: onDropModal,
    accept: { 'application/pdf': ['.pdf'] },
    noClick: true,
    noKeyboard: true
  });
  
  const handleAddSelectedPages = () => {
    const newDocIndex = files.length;
    const file = modalPdfThumbnails[0].file;
    
    pdfjsDocsRef.current.set(newDocIndex, modalPdfDocRef.current);

    const newPages: PageInfo[] = [];
    modalPdfThumbnails.forEach(thumb => {
      if(selectedModalPages.has(thumb.pageNum)) {
          const pageId = `doc-${newDocIndex}-page-${thumb.originalPageIndex}`;
           newPages.push({
                id: pageId,
                docIndex: newDocIndex,
                originalPageIndex: thumb.originalPageIndex,
                thumbnailDataUrl: thumb.dataUrl,
                fileName: file.name,
                file: file
            });
      }
    });

    setPages(p => [...p, ...newPages]);
    setFiles(f => [...f, file]);
    closeModal();
  };
  
  const closeModal = () => {
    setIsAddPagesModalOpen(false);
    setModalPdfThumbnails([]);
    setSelectedModalPages(new Set());
    modalPdfDocRef.current = null;
    setModalPreviews({});
    setActiveModalPreviewUrl(null);
    setActiveModalPreviewPageNum(null);
  };
  
  const handleModalThumbnailClick = (pageNum: number) => {
    const newSelected = new Set(selectedModalPages);
    if (newSelected.has(pageNum)) {
        newSelected.delete(pageNum);
    } else {
        newSelected.add(pageNum);
    }
    setSelectedModalPages(newSelected);
    renderModalPagePreview(pageNum);
  };

  const handleRemovePage = (id: string) => {
    setPages(pages.filter(p => p.id !== id));
  };
  
  const handleDragSort = () => {
    if (dragItem.current === undefined || dragOverItem.current === undefined) return;
    const _pages = [...pages];
    const dragItemContent = _pages.splice(dragItem.current!, 1)[0];
    _pages.splice(dragOverItem.current!, 0, dragItemContent);
    dragItem.current = undefined;
    dragOverItem.current = undefined;
    setPages(_pages);
  };
  
  const handleMerge = async () => {
    if (pages.length === 0) {
        setError("There are no pages to merge.");
        return;
    }
    setIsMerging(true);
    setError(null);
    try {
        const newPdfDoc = await PDFDocument.create();
        const loadedPdfLibDocs = new Map<number, PDFDocument>();

        for (const pageInfo of pages) {
            let sourceDoc = loadedPdfLibDocs.get(pageInfo.docIndex);
            if (!sourceDoc) {
                const arrayBuffer = await pageInfo.file.arrayBuffer();
                sourceDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
                loadedPdfLibDocs.set(pageInfo.docIndex, sourceDoc);
            }
            const [copiedPage] = await newPdfDoc.copyPages(sourceDoc, [pageInfo.originalPageIndex]);
            newPdfDoc.addPage(copiedPage);
        }

        const pdfBytes = await newPdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'merged-document.pdf';
        link.click();
        URL.revokeObjectURL(link.href);

        trackEvent('pdf_pages_merged', { pageCount: pages.length, docCount: files.length });
        trackGtagEvent('tool_used', {
            event_category: 'PDF & Document Tools',
            event_label: 'Combine & Reorder PDF Pages',
            tool_name: 'combine-and-reorder-pdf-pages',
            is_download: true,
            page_count: pages.length,
            file_count: files.length,
        });
        handleReset();

    } catch (err) {
        console.error(err);
        setError("An error occurred while merging the PDF.");
    } finally {
        setIsMerging(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setPages([]);
    setPreviews({});
    setActivePreviewUrl(null);
    setActivePreviewId(null);
    pdfjsDocsRef.current.clear();
  };
  
  if (!isLibraryReady) {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-50 p-6 rounded-lg border min-h-[300px]">
         {libraryError ? (
            <InfoIcon className="w-12 h-12 text-red-500 mb-4" />
         ) : (
            <LoaderIcon className="w-12 h-12 text-blue-600 animate-spin mb-6" />
         )}
         <h2 className="text-2xl font-bold text-gray-800 mb-2">{libraryError ? 'Library Error' : 'Initializing PDF Engine...'}</h2>
         <p className="text-gray-600">{libraryError || 'This should only take a moment.'}</p>
      </div>
    );
  }
  
  if (files.length === 0) {
      return (
          <div {...getRootProps()} className={`p-12 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}>
            <input {...getInputProps()} />
            <UploadIcon className="w-12 h-12 text-gray-400 mx-auto" />
            <p className="mt-2 text-lg font-semibold text-gray-700">Drop PDF files here or click to select</p>
            <p className="text-sm text-gray-500">Add one or more files to combine their pages</p>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
      );
  }

  return (
    <>
      {isAddPagesModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold">Select Pages to Add</h2>
                    <button onClick={closeModal}><CloseIcon className="w-6 h-6" /></button>
                </div>
                
                <div className="flex flex-grow overflow-hidden">
                    <div className="w-1/3 border-r overflow-y-auto p-4 bg-gray-100">
                        {modalPdfProcessing ? <LoaderIcon className="w-8 h-8 animate-spin mx-auto mt-10" /> : (
                            <div className="grid grid-cols-3 gap-4">
                                {modalPdfThumbnails.map(thumb => (
                                    <div key={thumb.pageNum} onClick={() => handleModalThumbnailClick(thumb.pageNum)}
                                        className={`relative border-2 rounded-md cursor-pointer transition-all ${selectedModalPages.has(thumb.pageNum) ? 'border-blue-500' : (activeModalPreviewPageNum === thumb.pageNum ? 'border-blue-300' : 'border-transparent hover:border-blue-200')}`}>
                                        <img src={thumb.dataUrl} alt={`Page ${thumb.pageNum}`} className="w-full h-auto" />
                                        <p className="text-center text-xs py-1">{thumb.pageNum}</p>
                                        {selectedModalPages.has(thumb.pageNum) && (
                                             <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center pointer-events-none">
                                                <CheckIcon className="w-3 h-3" strokeWidth={3} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="w-2/3 flex flex-col items-center justify-center p-4">
                        <h3 className="text-sm font-semibold text-gray-600 mb-2">Page Preview {activeModalPreviewPageNum && `(${activeModalPreviewPageNum} / ${modalPdfThumbnails.length})`}</h3>
                        <div className="flex-grow w-full flex items-center justify-center bg-gray-200 rounded-lg p-2">
                            {isModalPreviewLoading ? (
                                <LoaderIcon className="w-10 h-10 text-blue-600 animate-spin" />
                            ) : activeModalPreviewUrl ? (
                                <img src={activeModalPreviewUrl} alt={`Preview of page ${activeModalPreviewPageNum}`} className="max-w-full max-h-full object-contain shadow-lg" />
                            ) : (
                                <p className="text-gray-500">Select a page to preview</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t flex justify-end gap-3">
                    <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
                    <button onClick={handleAddSelectedPages} disabled={selectedModalPages.size === 0} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">Add {selectedModalPages.size} Selected Pages</button>
                </div>
            </div>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 flex flex-col border rounded-lg bg-white shadow-sm max-h-[80vh]">
              <div {...getModalRootProps({className: 'flex items-center justify-between p-2 border-b bg-gray-50 rounded-t-lg'})}>
                  <input {...getModalInputProps()} />
                  <button onClick={openModalFileDialog} disabled={modalPdfProcessing} className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-100 rounded">
                      <PlusIcon className="w-3 h-3"/> Add Pages from PDF...
                  </button>
                  <button onClick={handleMerge} disabled={isMerging || pages.length === 0} className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                      {isMerging ? <LoaderIcon className="w-4 h-4 animate-spin" /> : <LayersIcon className="w-4 h-4" />}
                      Merge & Download ({pages.length})
                  </button>
              </div>

              {isProcessingFiles ? (
                  <div className="flex-grow flex items-center justify-center"><LoaderIcon className="w-8 h-8 text-blue-600 animate-spin" /><p className="ml-2">Processing...</p></div>
              ) : (
                  <div className="overflow-y-auto flex-grow p-2 bg-gray-100">
                      <div className="grid grid-cols-3 gap-2">
                          {pages.map((page, index) => (
                              <div
                                  key={page.id}
                                  onClick={() => renderAndCachePageAsPreview(page)}
                                  draggable
                                  onDragStart={() => dragItem.current = index}
                                  onDragEnter={() => dragOverItem.current = index}
                                  onDragEnd={handleDragSort}
                                  onDragOver={(e) => e.preventDefault()}
                                  className={`relative border-2 rounded-md cursor-grab group ${activePreviewId === page.id ? 'border-blue-500' : 'border-transparent hover:border-blue-300'}`}
                              >
                                  <img src={page.thumbnailDataUrl} alt={`Page from ${page.fileName}`} className="w-full h-auto bg-white shadow-sm rounded-sm" />
                                  <p className="text-center text-[10px] text-gray-600 py-0.5 bg-white bg-opacity-70 rounded-b-sm truncate px-1" title={page.fileName}>{page.originalPageIndex + 1}</p>
                                  <button onClick={(e) => { e.stopPropagation(); handleRemovePage(page.id); }} className="absolute top-0 right-0 bg-red-500 text-white rounded-bl-md rounded-tr-sm w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <CloseIcon className="w-3 h-3" strokeWidth={3}/>
                                  </button>
                              </div>
                          ))}
                      </div>
                  </div>
              )}
          </div>

          <div className="lg:col-span-2 flex flex-col">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Page Preview</h3>
              <div className="flex-grow flex items-center justify-center p-2 border rounded-lg bg-gray-200 min-h-[400px] lg:min-h-0">
                  {isPreviewLoading ? (
                       <LoaderIcon className="w-10 h-10 text-blue-600 animate-spin" />
                  ) : activePreviewUrl ? (
                      <img src={activePreviewUrl} alt="Page Preview" className="max-w-full max-h-full object-contain shadow-lg" />
                  ) : (
                      <p className="text-gray-500">Select a page to preview</p>
                  )}
              </div>
               <button onClick={handleReset} className="mt-4 text-sm text-blue-600 hover:underline text-center">
                  Start Over
              </button>
          </div>
      </div>
    </>
  );
};

export default MergePdf;