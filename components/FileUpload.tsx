import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  acceptedMimeTypes: string[];
  title?: string;
  description?: string;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, acceptedMimeTypes, title, description, disabled }) => {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    setError(null);
    if (fileRejections.length > 0) {
      setError(`File type not accepted. Please upload one of: ${acceptedMimeTypes.join(', ')}`);
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
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={`p-8 border-2 border-dashed rounded-lg text-center transition-colors ${
        disabled 
          ? 'border-gray-300 bg-gray-100 cursor-not-allowed' 
          : isDragActive 
          ? 'border-blue-500 bg-blue-50 cursor-pointer' 
          : 'border-gray-300 hover:border-gray-400 cursor-pointer'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="text-lg font-semibold text-gray-700">{title || "Drag 'n' drop a file here, or click to select"}</p>
        <p className="text-sm text-gray-500">{description || `Accepted formats: ${acceptedMimeTypes.join(', ')}`}</p>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default FileUpload;