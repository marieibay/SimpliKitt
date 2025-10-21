import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { trackEvent } from '../../analytics';
import { UploadIcon } from '../../components/Icons';

interface Base64Result {
  [filename: string]: string;
}

const BulkImageToBase64: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [jsonUrl, setJsonUrl] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    if (fileRejections.length > 0) {
      setError("Some files were not valid image types and were ignored.");
    } else {
      setError(null);
    }
    setFiles(prev => [...prev, ...acceptedFiles]);
    setJsonUrl(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [], 'image/gif': [] },
  });

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      setError("Please add at least one image.");
      return;
    }

    setIsProcessing(true);
    setProgress('Starting...');
    setError(null);

    try {
      const results: Base64Result = {};
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress(`Encoding ${i + 1} of ${files.length}: ${file.name}`);
        results[file.name] = await fileToBase64(file);
      }

      setProgress('Creating JSON file...');
      const jsonString = JSON.stringify(results, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      setJsonUrl(URL.createObjectURL(blob));
      trackEvent('bulk_images_to_base64', { fileCount: files.length });
    } catch (err: any) {
      setError(`An error occurred: ${err.message}`);
    } finally {
      setIsProcessing(false);
      setProgress('');
    }
  };
  
  const handleReset = () => {
      setFiles([]);
      if (jsonUrl) URL.revokeObjectURL(jsonUrl);
      setJsonUrl(null);
      setError(null);
  }

  return (
    <div className="space-y-6">
      {!isProcessing && !jsonUrl && (
        <>
          <div {...getRootProps()} className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-white'}`}>
            <input {...getInputProps()} />
            <UploadIcon className="w-12 h-12 text-gray-400 mx-auto" />
            <p className="mt-2 text-lg font-semibold text-gray-700">Drag & drop images here, or click to select</p>
            <p className="text-sm text-gray-500">Supports JPG, PNG, WEBP, GIF</p>
          </div>
        </>
      )}

      {error && <p className="text-center text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
      
      {files.length > 0 && !isProcessing && !jsonUrl && (
        <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Image Queue ({files.length})</h3>
            <ul className="space-y-1 text-sm text-gray-600 max-h-40 overflow-y-auto border rounded-lg p-2 bg-gray-50">
                {files.map((file, i) => <li key={`${file.name}-${i}`} className="truncate">{file.name}</li>)}
            </ul>
            <button onClick={handleConvert} className="w-full px-8 py-3 bg-blue-600 text-white text-md font-bold rounded-lg hover:bg-blue-700 transition">
              {`Encode ${files.length} Image(s) to Base64`}
            </button>
        </div>
      )}

      {isProcessing && (
        <div className="text-center p-8">
            <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <p className="text-lg font-semibold text-gray-700 mt-4">{progress}</p>
        </div>
      )}

      {jsonUrl && (
         <div className="text-center space-y-4 p-6 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-xl font-bold text-gray-800">Encoding Complete!</h3>
            <p className="text-gray-600">Your Base64 strings have been saved in a JSON file.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
                <a href={jsonUrl} download="base64-images.json" className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
                    Download JSON File
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

export default BulkImageToBase64;
