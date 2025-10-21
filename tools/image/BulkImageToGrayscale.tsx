import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { trackEvent } from '../../analytics';
import { UploadIcon } from '../../components/Icons';

declare global {
  interface Window {
    fflate: any;
  }
}

const BulkImageToGrayscale: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [zipUrl, setZipUrl] = useState<string | null>(null);
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
    setFiles(prev => [...prev, ...acceptedFiles]);
    setZipUrl(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
  });

  const convertToGrayscale = (file: File): Promise<Blob | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('Could not get canvas context'));

          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg;     // red
            data[i + 1] = avg; // green
            data[i + 2] = avg; // blue
          }
          ctx.putImageData(imageData, 0, 0);
          canvas.toBlob((blob) => resolve(blob), 'image/png');
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      setError("Please add at least one image.");
      return;
    }
    if (!window.fflate) {
      setError("ZIP library not loaded. Please refresh.");
      return;
    }

    setIsProcessing(true);
    setProgress('Starting...');
    setError(null);

    try {
      const processedFiles: Record<string, Uint8Array> = {};
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress(`Processing ${i + 1} of ${files.length}: ${file.name}`);
        const grayscaleBlob = await convertToGrayscale(file);
        if (grayscaleBlob) {
          const buffer = await grayscaleBlob.arrayBuffer();
          const baseName = file.name.replace(/\.[^/.]+$/, "");
          processedFiles[`${baseName}-grayscale.png`] = new Uint8Array(buffer);
        }
      }

      setProgress('Creating ZIP file...');
      window.fflate.zip(processedFiles, (err: any, data: Uint8Array) => {
        if (err) throw err;
        const blob = new Blob([data], { type: 'application/zip' });
        setZipUrl(URL.createObjectURL(blob));
        trackEvent('bulk_images_to_grayscale', { fileCount: files.length });
      });
    } catch (err: any) {
      setError(`An error occurred: ${err.message}`);
    } finally {
      setIsProcessing(false);
      setProgress('');
    }
  };
  
  const handleReset = () => {
      setFiles([]);
      if (zipUrl) URL.revokeObjectURL(zipUrl);
      setZipUrl(null);
      setError(null);
  }

  return (
    <div className="space-y-6">
      {!isProcessing && !zipUrl && (
        <div {...getRootProps()} className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-white'}`}>
          <input {...getInputProps()} />
          <UploadIcon className="w-12 h-12 text-gray-400 mx-auto" />
          <p className="mt-2 text-lg font-semibold text-gray-700">Drag & drop images here, or click to select</p>
          <p className="text-sm text-gray-500">Supports JPG, PNG, WEBP</p>
        </div>
      )}

      {error && <p className="text-center text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
      
      {files.length > 0 && !isProcessing && !zipUrl && (
        <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Image Queue ({files.length})</h3>
            <ul className="space-y-1 text-sm text-gray-600 max-h-40 overflow-y-auto border rounded-lg p-2 bg-gray-50">
                {files.map((file, i) => <li key={`${file.name}-${i}`} className="truncate">{file.name}</li>)}
            </ul>
            <button onClick={handleConvert} disabled={!isLibReady} className="w-full px-8 py-3 bg-blue-600 text-white text-md font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
              {!isLibReady ? 'Loading Library...' : `Convert ${files.length} Image(s) to Grayscale`}
            </button>
        </div>
      )}

      {isProcessing && (
        <div className="text-center p-8">
            <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <p className="text-lg font-semibold text-gray-700 mt-4">{progress}</p>
        </div>
      )}

      {zipUrl && (
         <div className="text-center space-y-4 p-6 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-xl font-bold text-gray-800">Conversion Complete!</h3>
            <p className="text-gray-600">Your grayscale images have been bundled into a ZIP file.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
                <a href={zipUrl} download="grayscale-images.zip" className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
                    Download ZIP
                </a>
                <button onClick={handleReset} className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition">
                    Start Over
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default BulkImageToGrayscale;
