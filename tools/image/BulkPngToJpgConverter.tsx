import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { trackEvent } from '../../analytics';
import { UploadIcon } from '../../components/Icons';

declare global {
  interface Window {
    JSZip: any;
  }
}

interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

const BulkPngToJpgConverter: React.FC = () => {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done'>('idle');
  const [progress, setProgress] = useState(0);
  const [zipUrl, setZipUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [libReady, setLibReady] = useState(false);

  useEffect(() => {
    if ((window as any).JSZip) {
      setLibReady(true);
      return;
    }
    let attempts = 0;
    const interval = setInterval(() => {
      if ((window as any).JSZip) {
        setLibReady(true);
        clearInterval(interval);
      } else if (attempts++ > 35) {
        clearInterval(interval);
        setError("ZIP library failed to load. Please refresh.");
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImageFiles = acceptedFiles.map(file => ({
      id: `${file.name}-${file.size}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
    }));
    setFiles(prev => [...prev, ...newImageFiles]);
    setStatus('idle');
    setZipUrl(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/png': [] },
  });

  const convertToJpg = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = e => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error("Could not get canvas context"));
          
          // Fill background with white for transparency
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          ctx.drawImage(img, 0, 0, img.width, img.height);
          canvas.toBlob(blob => {
            if (blob) resolve(blob);
            else reject(new Error("Canvas to Blob conversion failed"));
          }, 'image/jpeg', 0.92); // 0.92 is a good quality default
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    setStatus('processing');
    setProgress(0);
    setError(null);

    const JSZip = (window as any).JSZip;
    const zip = new JSZip();

    for (let i = 0; i < files.length; i++) {
      const { file } = files[i];
      try {
        const jpgBlob = await convertToJpg(file);
        const newFileName = file.name.replace(/\.png$/i, '.jpg');
        zip.file(newFileName, jpgBlob);
        setProgress(((i + 1) / files.length) * 100);
      } catch (err) {
        console.error(`Failed to process ${file.name}:`, err);
        setError(`Failed to process ${file.name}. Skipping.`);
      }
    }

    try {
      const content = await zip.generateAsync({ type: 'blob' });
      if (zipUrl) URL.revokeObjectURL(zipUrl);
      setZipUrl(URL.createObjectURL(content));
      setStatus('done');
      trackEvent('images_converted_in_bulk', { fileCount: files.length, from: 'png', to: 'jpg' });
    } catch (err) {
      setError('Failed to create ZIP file.');
      setStatus('idle');
    }
  };

  const handleReset = () => {
    files.forEach(f => URL.revokeObjectURL(f.preview));
    setFiles([]);
    setStatus('idle');
    setZipUrl(null);
    setError(null);
  };

  if (status === 'done' && zipUrl) {
    return (
      <div className="text-center space-y-4 p-6 bg-green-50 rounded-lg border border-green-200">
        <h3 className="text-xl font-bold text-gray-800">Conversion Complete!</h3>
        <p className="text-gray-600">{files.length} PNG images converted to JPG.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
          <a href={zipUrl} download="converted-jpg-images.zip" className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">Download ZIP</a>
          <button onClick={handleReset} className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition">Start Over</button>
        </div>
      </div>
    );
  }

  if (status === 'processing') {
    return (
      <div className="p-6 bg-gray-50 border rounded-lg text-center space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">Converting to JPG...</h3>
        <div className="w-full bg-gray-200 rounded-full h-4"><div className="bg-blue-600 h-4 rounded-full" style={{ width: `${progress}%` }}></div></div>
        <p className="text-sm text-gray-600">{Math.round(progress)}% Complete</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div {...getRootProps()} className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-white'}`}>
        <input {...getInputProps()} />
        <UploadIcon className="w-12 h-12 text-gray-400 mx-auto" />
        <p className="mt-2 text-lg font-semibold text-gray-700">Drag & drop PNG files here, or click to select</p>
        <p className="text-sm text-gray-500">Only PNG files are accepted</p>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="max-h-60 overflow-y-auto p-2 border rounded-lg space-y-2">
            {files.map(f => (
              <div key={f.id} className="flex items-center gap-3 bg-white p-2 rounded-md shadow-sm">
                <img src={f.preview} alt={f.file.name} className="w-12 h-12 object-cover rounded"/>
                <p className="text-sm font-medium text-gray-800 truncate">{f.file.name}</p>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t flex justify-center items-center gap-4">
            <button onClick={handleConvert} disabled={!libReady} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300">
              {!libReady ? 'Initializing...' : `Convert ${files.length} Image(s) to JPG`}
            </button>
            <button onClick={handleReset} className="text-sm text-gray-600 hover:underline">Clear All</button>
          </div>
        </div>
      )}

      {error && <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg"><p className="font-semibold">An Error Occurred</p><p className="text-sm">{error}</p></div>}
    </div>
  );
};

export default BulkPngToJpgConverter;
