import React, { useState } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

const FileExtensionChanger: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [newExtension, setNewExtension] = useState('.txt');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState<string>('');

  const handleFile = (selectedFile: File) => {
    setFile(selectedFile);
    setDownloadUrl(null);
    setNewFileName('');
  };

  const handleChange = () => {
    if (!file) return;

    const baseName = file.name.includes('.')
      ? file.name.substring(0, file.name.lastIndexOf('.'))
      : file.name;
    
    const finalExtension = newExtension.startsWith('.') ? newExtension : `.${newExtension}`;
    const finalFileName = `${baseName}${finalExtension}`;
    setNewFileName(finalFileName);

    const renamedFile = new File([file], finalFileName, { type: file.type, lastModified: file.lastModified });
    const url = URL.createObjectURL(renamedFile);
    setDownloadUrl(url);

    trackEvent('file_extension_changed', { original: file.name, new: finalFileName });
  };
  
  const handleReset = () => {
    setFile(null);
    setNewExtension('.txt');
    setDownloadUrl(null);
    setNewFileName('');
    if(downloadUrl) URL.revokeObjectURL(downloadUrl);
  }

  return (
    <div className="space-y-6">
      {!file && (
        <FileUpload
          onFileUpload={handleFile}
          acceptedMimeTypes={[]}
          title="Upload a file to change its extension"
          description="All file types accepted"
        />
      )}

      {file && !downloadUrl && (
        <div className="space-y-4">
            <div className="p-4 bg-gray-50 border rounded-lg text-center">
                <p className="font-semibold text-gray-800">{file.name}</p>
                <p className="text-sm text-gray-600">File selected</p>
            </div>
            <div>
                <label htmlFor="new-extension" className="block text-sm font-medium text-gray-700 mb-1">
                    New Extension
                </label>
                <input
                    type="text"
                    id="new-extension"
                    value={newExtension}
                    onChange={e => setNewExtension(e.target.value)}
                    placeholder="e.g., .log"
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
            </div>
            <button
                onClick={handleChange}
                className="w-full px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
                Change Extension
            </button>
        </div>
      )}

      {downloadUrl && (
        <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Success!</h3>
            <p className="text-gray-600">Your file is ready to be downloaded as <span className="font-mono bg-gray-100 p-1 rounded">{newFileName}</span>.</p>
            <div className="flex justify-center gap-4">
                <a 
                    href={downloadUrl}
                    download={newFileName}
                    className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                >
                    Download File
                </a>
                 <button 
                    onClick={handleReset}
                    className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
                >
                    Start Over
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default FileExtensionChanger;