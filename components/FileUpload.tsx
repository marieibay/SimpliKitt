import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  acceptedMimeTypes: string[];
  title?: string;
  description?: string;
  externalError?: string | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, acceptedMimeTypes, title, description, externalError }) => {
  const [internalError, setInternalError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    setInternalError(null);
    if (fileRejections.length > 0) {
      setInternalError(`File type not accepted. Please upload one of: ${acceptedMimeTypes.join(', ')}`);
      return;
    }
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload, acceptedMimeTypes]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedMimeTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    multiple: false,
  });

  const displayError = externalError || internalError;

  return (
    <div
      {...getRootProps()}
      className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-blue-500 bg-blue-50' : (displayError ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400')
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="text-lg font-semibold text-gray-700">{title || "Drag 'n' drop a file here, or click to select"}</p>
        <p className="text-sm text-gray-500">{description || `Accepted formats: ${acceptedMimeTypes.join(', ')}`}</p>
        {displayError && <p className="mt-2 text-sm text-red-600">{displayError}</p>}
      </div>
    </div>
  );
};

export default FileUpload;