import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { trackEvent } from '../../analytics';

// Add type definition for global jsPDF library
declare global {
  interface Window {
    jspdf: any;
  }
}

interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

const ImageToPdfConverter: React.FC = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [outputPdfUrl, setOutputPdfUrl] = useState<string | null>(null);

  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'legal'>('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  
  const draggedItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setOutputPdfUrl(null);
    const newImageFiles = acceptedFiles.map(file => ({
      id: `${file.name}-${file.size}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages(prev => [...prev, ...newImageFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
  });

  const handleRemoveImage = (id: string) => {
    setImages(prev => prev.filter(image => image.id !== id));
  };
  
  const handleDragSort = () => {
    if (draggedItem.current === null || dragOverItem.current === null) return;
    const newImages = [...images];
    const draggedImage = newImages.splice(draggedItem.current, 1)[0];
    newImages.splice(dragOverItem.current, 0, draggedImage);
    draggedItem.current = null;
    dragOverItem.current = null;
    setImages(newImages);
  };

  const handleConvert = async () => {
    if (images.length === 0) {
      setError("Please upload at least one image.");
      return;
    }
    if (!window.jspdf) {
      setError("PDF generation library failed to load. Please refresh the page.");
      return;
    }
    setIsProcessing(true);
    setError(null);
    
    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ orientation, unit: 'pt', format: pageSize });

      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        if (i > 0) doc.addPage();
        
        const img = new Image();
        img.src = image.preview;
        await new Promise(resolve => { img.onload = resolve; });
        
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        
        const ratio = Math.min(pageWidth / img.width, pageHeight / img.height);
        const imgWidth = img.width * ratio;
        const imgHeight = img.height * ratio;
        
        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;
        
        const imgData = await fetch(image.preview).then(r => r.blob());
        const reader = new FileReader();
        await new Promise<void>(resolve => {
            reader.onload = () => resolve();
            reader.readAsDataURL(imgData);
        });
        
        doc.addImage(reader.result as string, image.file.type.split('/')[1].toUpperCase(), x, y, imgWidth, imgHeight);
      }
      
      const pdfBlob = doc.output('blob');
      setOutputPdfUrl(URL.createObjectURL(pdfBlob));
      trackEvent('images_to_pdf_converted', {
        imageCount: images.length,
        pageSize,
        orientation,
      });

    } catch (err: any) {
      setError(`An error occurred: ${err.message || 'Unknown error'}`);
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleReset = () => {
    images.forEach(image => URL.revokeObjectURL(image.preview));
    setImages([]);
    setOutputPdfUrl(null);
    setError(null);
    setIsProcessing(false);
  }

  return (
    <div className="space-y-6">
      {!outputPdfUrl && (
        <>
            <div {...getRootProps()} className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}>
                <input {...getInputProps()} />
                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <p className="text-lg font-semibold text-gray-700 mt-2">Drag & drop images here, or click to select</p>
                <p className="text-sm text-gray-500">Supports JPG, PNG, WEBP</p>
            </div>

            {images.length > 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 border rounded-lg">
                <div>
                  <label htmlFor="page-size" className="block text-sm font-medium text-gray-700">Page Size</label>
                  <select id="page-size" value={pageSize} onChange={e => setPageSize(e.target.value as any)} className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm">
                    <option value="a4">A4</option>
                    <option value="letter">Letter</option>
                    <option value="legal">Legal</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="orientation" className="block text-sm font-medium text-gray-700">Orientation</label>
                  <select id="orientation" value={orientation} onChange={e => setOrientation(e.target.value as any)} className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm">
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>
              </div>

              <h3 className="text-lg font-medium text-gray-800">Image Queue ({images.length})</h3>
              <ul className="space-y-2 max-h-80 overflow-y-auto">
                {images.map((image, index) => (
                  <li key={image.id} draggable onDragStart={() => (draggedItem.current = index)} onDragEnter={() => (dragOverItem.current = index)} onDragEnd={handleDragSort} onDragOver={(e) => e.preventDefault()}
                    className="flex items-center justify-between p-2 bg-white border rounded-lg shadow-sm cursor-grab">
                    <div className="flex items-center space-x-3">
                      <img src={image.preview} alt={image.file.name} className="w-12 h-12 object-cover rounded-md" />
                      <span className="font-medium text-gray-700 truncate">{image.file.name}</span>
                    </div>
                    <button onClick={() => handleRemoveImage(image.id)} className="text-gray-400 hover:text-red-500 p-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t flex justify-center">
                <button onClick={handleConvert} disabled={isProcessing} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300">
                    {isProcessing ? 'Creating PDF...' : `Create PDF from ${images.length} Image(s)`}
                </button>
              </div>
            </div>
            )}
        </>
      )}

      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
            <p className="font-semibold">An Error Occurred</p>
            <p className="text-sm">{error}</p>
        </div>
      )}

      {outputPdfUrl && (
        <div className="text-center space-y-4 p-6 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-xl font-bold text-gray-800">Your PDF is Ready!</h3>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
                <a href={outputPdfUrl} download="converted.pdf" className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
                    Download PDF
                </a>
                <button onClick={handleReset} className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition">
                    Create Another
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default ImageToPdfConverter;
