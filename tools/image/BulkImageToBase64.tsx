import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { trackEvent } from '../../analytics';
import { UploadIcon } from '../../components/Icons';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

const BulkImageToBase64: React.FC = () => {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done'>('idle');
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImageFiles = acceptedFiles.map(file => ({
      id: `${file.name}-${file.size}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
    }));
    setFiles(prev => [...prev, ...newImageFiles]);
    setStatus('idle');
    setDownloadUrl(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
  });

  const convertFileToBase64 = (file: File): Promise<{ name: string; data: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve({ name: file.name, data: reader.result as string });
      reader.onerror = error => reject(error);
    });
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    setStatus('processing');
    setProgress(0);
    setError(null);

    let allBase64Strings = '';
    for (let i = 0; i < files.length; i++) {
      try {
        const { name, data } = await convertFileToBase64(files[i].file);
        allBase64Strings += `--- ${name} ---\n${data}\n\n`;
        setProgress(((i + 1) / files.length) * 100);
      } catch (err) {
        console.error(`Failed to process ${files[i].file.name}:`, err);
        setError(`Failed to process ${files[i].file.name}. Skipping.`);
      }
    }

    try {
      const blob = new Blob([allBase64Strings], { type: 'text/plain;charset=utf-8' });
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(URL.createObjectURL(blob));
      setStatus('done');
      trackEvent('images_to_base64_in_bulk', { fileCount: files.length });
    } catch (err) {
      setError('Failed to create text file.');
      setStatus('idle');
    }
  };

  const handleReset = () => {
    files.forEach(f => URL.revokeObjectURL(f.preview));
    setFiles([]);
    setStatus('idle');
    setDownloadUrl(null);
    setError(null);
  };

  if (status === 'done' && downloadUrl) {
    return (
      <div className="text-center space-y-4 p-6 bg-green-50 rounded-lg border border-green-200">
        <h3 className="text-xl font-bold text-gray-800">Conversion Complete!</h3>
        <p className="text-gray-600">{files.length} images converted to Base64.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
          <a href={downloadUrl} download="base64-images.txt" className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">Download Text File</a>
          <button onClick={handleReset} className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition">Start Over</button>
        </div>
      </div>
    );
  }

  if (status === 'processing') {
    return (
      <div className="p-6 bg-gray-50 border rounded-lg text-center space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">Converting to Base64...</h3>
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
        <p className="mt-2 text-lg font-semibold text-gray-700">Drag & drop images here, or click to select</p>
        <p className="text-sm text-gray-500">All image types accepted</p>
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
            <button onClick={handleConvert} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">
              Convert {files.length} Image(s) to Base64
            </button>
            <button onClick={handleReset} className="text-sm text-gray-600 hover:underline">Clear All</button>
          </div>
        </div>
      )}

      {error && <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg"><p className="font-semibold">An Error Occurred</p><p className="text-sm">{error}</p></div>}
    </div>
  );
};

export default BulkImageToBase64;
