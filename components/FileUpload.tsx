import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadIcon } from './Icons';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  acceptedMimeTypes: string[];
  title?: string;
  description?: string;
  externalError?: string | null;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, acceptedMimeTypes, title, description, externalError, disabled }) => {
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
    disabled,
  });

  const displayError = externalError || internalError;

  return (
    <div
      {...getRootProps()}
      className={`p-8 border-2 border-dashed rounded-lg text-center transition-colors ${
        disabled ? 'cursor-not-allowed bg-gray-100' : 'cursor-pointer'
      } ${
        isDragActive ? 'border-blue-500 bg-blue-50' : (displayError ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400')
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-2">
        <UploadIcon className="w-12 h-12 text-gray-400" />
        {displayError ? (
          <p className="text-lg font-semibold text-red-700">{displayError}</p>
        ) : (
          <>
            <p className="text-lg font-semibold text-gray-700">{title || "Drag 'n' drop a file here, or click to select"}</p>
            <p className="text-sm text-gray-500">{description || `Accepted formats: ${acceptedMimeTypes.join(', ')}`}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;