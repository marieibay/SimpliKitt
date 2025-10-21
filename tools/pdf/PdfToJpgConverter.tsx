import React, { useState, useEffect, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

// Add type definitions for global libraries to satisfy TypeScript
declare global {
  interface Window {
    pdfjsLib: any;
    JSZip: any;
  }
}

interface ConvertedImage {
  pageNumber: number;
  dataUrl: string;
  filename: string;
}

const PdfToJpgConverter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);
  const [outputFormat, setOutputFormat] = useState<'jpeg' | 'png'>('jpeg');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set workerSrc for pdf.js safely after component mounts
    if (window.pdfjsLib) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.3.136/pdf.worker.min.js`;
    }
  }, []);

  const handleFile = (selectedFile: File) => {
    setFile(selectedFile);
    setConvertedImages([]);
    setError(null);
  };

  const convertPdfToImages = async () => {
    if (!file) {
      setError("Please upload a PDF file first.");
      return;
    }
    if (!window.pdfjsLib) {
      setError("PDF processing library failed to load. Please refresh and try again.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setConvertedImages([]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
      const pdfDocument = await loadingTask.promise;
      const numPages = pdfDocument.numPages;
      const images: ConvertedImage[] = [];
      const baseName = file.name.replace(/\.pdf$/i, '');

      for (let i = 1; i <= numPages; i++) {
        const page = await pdfDocument.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 });
        
        const canvas = document.createElement('canvas');
        const canvasContext = canvas.getContext('2d');
        if (!canvasContext) throw new Error("Could not get 2D canvas context.");
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext, viewport }).promise;
        
        const mimeType = `image/${outputFormat}`;
        const quality = outputFormat === 'jpeg' ? 0.92 : undefined;
        const dataUrl = canvas.toDataURL(mimeType, quality);
        
        images.push({
          pageNumber: i,
          dataUrl,
          filename: `${baseName}-page-${i}.${outputFormat === 'jpeg' ? 'jpg' : 'png'}`,
        });
      }
      setConvertedImages(images);
      trackEvent('pdf_to_images_converted', {
        pageCount: numPages,
        format: outputFormat,
      });
    } catch (err: any) {
      console.error("PDF Conversion Error:", err);
      setError(`Failed to convert PDF: ${err.message || 'Unknown error'}. It might be corrupted or encrypted.`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleDownloadAllAsZip = async () => {
    if (convertedImages.length === 0) return;
    const JSZip = (window as any).JSZip;
    if (!JSZip) {
        setError("ZIP compression library failed to load. Please refresh and try again.");
        return;
    }

    const zip = new JSZip();
    
    for (const image of convertedImages) {
        const response = await fetch(image.dataUrl);
        const blob = await response.blob();
        zip.file(image.filename, blob);
    }
    
    const content = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    const zipFileName = `${file?.name.replace(/\.pdf$/i, '') || 'images'}.zip`;
    link.download = zipFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    trackEvent('downloaded_converted_images_zip', {
        imageCount: convertedImages.length,
        format: outputFormat
    });
  };

  const handleReset = () => {
    setFile(null);
    setConvertedImages([]);
    setError(null);
    setIsProcessing(false);
  };

  if (isProcessing) {
    return (
      <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-lg">
        <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg font-semibold text-gray-700 mt-4">Converting your PDF...</p>
        <p className="text-sm text-gray-500 mt-1">This may take a moment for large files.</p>
      </div>
    );
  }

  if (error) {
     return (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
            <p className="font-semibold">An Error Occurred</p>
            <p className="text-sm">{error}</p>
            <button onClick={handleReset} className="mt-2 text-sm text-blue-600 hover:underline font-medium">
                Try again
            </button>
        </div>
     )
  }

  if (convertedImages.length > 0) {
    return (
        <div className="space-y-6">
            <div className="text-center space-y-3 p-6 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-xl font-bold text-gray-800">Conversion Complete!</h3>
              <p className="text-gray-600">{convertedImages.length} page{convertedImages.length > 1 ? 's' : ''} converted.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                <button 
                  onClick={handleDownloadAllAsZip}
                  className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                >
                  Download All as ZIP
                </button>
                <button 
                  onClick={handleReset}
                  className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
                >
                  Convert Another
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto p-4 bg-gray-50 border rounded-lg">
              {convertedImages.map((image) => (
                <div key={image.pageNumber} className="bg-white rounded-lg shadow-sm border p-2 text-center">
                  <div className="mb-2 bg-gray-100 rounded overflow-hidden flex items-center justify-center h-40">
                    <img src={image.dataUrl} alt={`Page ${image.pageNumber}`} className="max-w-full max-h-full object-contain"/>
                  </div>
                  <p className="text-xs font-medium text-gray-600">Page {image.pageNumber}</p>
                </div>
              ))}
            </div>
        </div>
    );
  }

  if (file) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
              <span className="font-semibold text-gray-800 truncate max-w-md">{file.name}</span>
              <button onClick={handleReset} className="text-sm text-blue-600 hover:underline font-medium">
                Change file
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-50 p-4 rounded-lg border">
              <label className="font-medium text-gray-700 mb-2 sm:mb-0">Output Format:</label>
              <div className="flex p-1 bg-gray-200 rounded-lg">
                <button onClick={() => setOutputFormat('jpeg')} className={`px-6 py-2 text-sm font-semibold rounded-md transition ${outputFormat === 'jpeg' ? 'bg-white shadow text-blue-600' : 'text-gray-600'}`}>JPEG</button>
                <button onClick={() => setOutputFormat('png')} className={`px-6 py-2 text-sm font-semibold rounded-md transition ${outputFormat === 'png' ? 'bg-white shadow text-blue-600' : 'text-gray-600'}`}>PNG</button>
              </div>
            </div>
            
            <button onClick={convertPdfToImages} className="w-full px-8 py-3 bg-blue-600 text-white text-md font-bold rounded-lg hover:bg-blue-700 transition">
              Convert to {outputFormat.toUpperCase()}
            </button>
        </div>
    );
  }

  return (
    <FileUpload 
      onFileUpload={handleFile}
      acceptedMimeTypes={['application/pdf']}
      title="Upload a PDF to Convert to Images"
    />
  );
};

export default PdfToJpgConverter;