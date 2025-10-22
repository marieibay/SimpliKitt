import React, { useState, useMemo, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { trackEvent } from '../../analytics';
import { UploadIcon } from '../../components/Icons';

declare global {
  interface Window {
    JSZip: any;
  }
}

const BatchFileRenamer: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [prefix, setPrefix] = useState('renamed-');
  const [startNumber, setStartNumber] = useState('1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const newFileNames = useMemo(() => {
    const startNum = parseInt(startNumber, 10) || 1;
    return files.map((file, index) => {
      const extension = file.name.includes('.') ? file.name.substring(file.name.lastIndexOf('.')) : '';
      return `${prefix}${startNum + index}${extension}`;
    });
  }, [files, prefix, startNumber]);

  const handleDownload = async () => {
    if (files.length === 0) {
      setError("Please add files to rename.");
      return;
    }
    const JSZip = (window as any).JSZip;
    if (!JSZip) {
        setError("ZIP compression library failed to load. Please refresh and try again.");
        return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const zip = new JSZip();
      files.forEach((file, index) => {
          zip.file(newFileNames[index], file);
      });

      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'renamed_files.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      
      trackEvent('files_renamed_and_zipped', { fileCount: files.length });

    } catch (err: any) {
      setError(`An error occurred: ${err.message || 'Unknown error'}`);
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setPrefix('renamed-');
    setStartNumber('1');
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div {...getRootProps()} className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-white'}`}>
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-3">
              <UploadIcon className="w-12 h-12 text-gray-400" />
              <p className="text-lg font-semibold text-gray-700">
                  {isDragActive ? "Drop the files here ..." : "Drag & drop files here, or click to select"}
              </p>
              <p className="text-sm text-gray-500">Add all the files you want to rename at once</p>
          </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 border rounded-lg">
            <div>
              <label htmlFor="prefix" className="block text-sm font-medium text-gray-700">Filename Prefix</label>
              <input type="text" id="prefix" value={prefix} onChange={e => setPrefix(e.target.value)} className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="startNumber" className="block text-sm font-medium text-gray-700">Start Number</label>
              <input type="number" id="startNumber" value={startNumber} onChange={e => setStartNumber(e.target.value)} className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm" />
            </div>
          </div>

          <h3 className="text-lg font-medium text-gray-800">Rename Preview ({files.length} files)</h3>
          <div className="max-h-60 overflow-y-auto border rounded-lg overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[500px]">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2">Original Name</th>
                  <th className="px-4 py-2">New Name</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {files.map((file, index) => (
                  <tr key={file.name + index} className="border-t">
                    <td className="px-4 py-2 truncate max-w-xs">{file.name}</td>
                    <td className="px-4 py-2 font-medium text-gray-800 truncate max-w-xs">{newFileNames[index]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {error && <p className="text-center text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
          
          <div className="flex justify-center items-center gap-4 pt-4 border-t">
            <button onClick={handleDownload} disabled={isProcessing} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300">
              {isProcessing ? 'Processing...' : 'Rename & Download ZIP'}
            </button>
            <button onClick={handleReset} className="px-4 py-2 text-sm text-gray-600 hover:underline">
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchFileRenamer;