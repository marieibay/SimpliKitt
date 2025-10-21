import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { trackEvent } from '../../analytics';
import { UploadIcon } from '../../components/Icons';

// Added fflate declaration
declare global {
  interface Window {
    fflate: any;
  }
}

const BulkImageResizer: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [width, setWidth] = useState<number>(1024);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLibReady, setIsLibReady] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.fflate) {
        setIsLibReady(true);
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    if (fileRejections.length > 0) {
      setError("Some files were not valid image types and were ignored.");
    } else {
      setError(null);
    }
    setFiles(acceptedFiles); // Replace existing files
    setStatus('');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
  });


  const handleResizeAndZip = async () => {
    if (files.length === 0 || !isLibReady) return;
    
    if (!window.fflate) {
        setError("ZIP library not loaded. Please refresh.");
        setIsProcessing(false);
        return;
    }

    setIsProcessing(true);
    setStatus('Initializing...');
    setError(null);
    
    const resizedFilesToZip: Record<string, Uint8Array> = {};

    try {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            setStatus(`Resizing ${i + 1}/${files.length}: ${file.name}`);
            
            const imageBitmap = await createImageBitmap(file);
            const originalWidth = imageBitmap.width;
            const originalHeight = imageBitmap.height;
            const aspectRatio = originalHeight / originalWidth;
            const newHeight = Math.round(width * aspectRatio);

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = newHeight;
            const ctx = canvas.getContext('2d');
            if(!ctx) {
                console.warn(`Could not get canvas context for ${file.name}`);
                continue; // Skip this file
            };
            
            ctx.drawImage(imageBitmap, 0, 0, width, newHeight);

            const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));
            if (blob) {
                const buffer = await blob.arrayBuffer();
                // Keep original extension if it's a known image type, otherwise use jpg
                const extension = (/\.(jpe?g|png|webp)$/i.exec(file.name) || ['.jpg'])[0];
                const baseName = file.name.replace(/\.[^/.]+$/, "");
                resizedFilesToZip[`${baseName}-resized${extension}`] = new Uint8Array(buffer);
            }
        }
        
        setStatus('Creating ZIP file...');
        window.fflate.zip(resizedFilesToZip, (err: any, data: Uint8Array) => {
            if (err) {
                throw err; // will be caught by the outer catch block
            }
            const zipBlob = new Blob([data], { type: 'application/zip' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(zipBlob);
            link.download = 'resized-images.zip';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);

            trackEvent('bulk_images_resized', { fileCount: files.length, width });
            setStatus('Done! Your download has started.');
            setIsProcessing(false);
            setFiles([]); // Reset after download
        });

    } catch(e: any) {
        setError(`An error occurred: ${e.message}`);
        setIsProcessing(false);
        setStatus('Error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
       <div {...getRootProps()} className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-white'}`}>
          <input {...getInputProps()} />
          <UploadIcon className="w-12 h-12 text-gray-400 mx-auto" />
          <p className="mt-2 text-lg font-semibold text-gray-700">Drag & drop images here, or click to select</p>
          <p className="text-sm text-gray-500">Supports JPG, PNG, WEBP</p>
      </div>
      
      {files.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-lg border space-y-6">
              <div>
                  <h3 className="text-lg font-medium text-gray-800">Image Queue ({files.length})</h3>
                  <ul className="space-y-1 text-sm text-gray-600 max-h-40 overflow-y-auto border rounded-lg p-2 bg-gray-50 mt-2">
                      {files.map((file, i) => <li key={`${file.name}-${i}`} className="truncate">{file.name}</li>)}
                  </ul>
              </div>

              <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-2">Set Max Width: <span className="font-bold text-blue-600">{width}px</span></label>
                  <p className="text-sm text-gray-500 mb-2">All images will be resized to this width while maintaining their original aspect ratio.</p>
                  <input type="range" min="100" max="4000" step="10" value={width} onChange={e => setWidth(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
              </div>
              
              <button onClick={handleResizeAndZip} disabled={files.length === 0 || isProcessing || !isLibReady} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg">
                {isProcessing ? status : !isLibReady ? 'Loading Library...' : `Resize ${files.length} Image(s) & Download ZIP`}
              </button>
              
              {error && <p className="text-center text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
          </div>
      )}
    </div>
  );
};

export default BulkImageResizer;