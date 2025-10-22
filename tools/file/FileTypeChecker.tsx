import React, { useState } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

// A small map of common file signatures (magic numbers)
const signatures: { [key: string]: string } = {
    '89504e47': 'image/png',
    'ffd8ffe0': 'image/jpeg',
    'ffd8ffe1': 'image/jpeg',
    'ffd8ffe2': 'image/jpeg',
    '47494638': 'image/gif',
    '25504446': 'application/pdf',
    '504b0304': 'application/zip',
};

const FileTypeChecker: React.FC = () => {
    const [fileInfo, setFileInfo] = useState<{ name: string; declared: string; actual: string } | null>(null);

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const arr = new Uint8Array(e.target!.result as ArrayBuffer).subarray(0, 4);
            const header = Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
            
            const actualType = signatures[header] || 'Unknown';
            setFileInfo({
                name: file.name,
                declared: file.type || 'N/A',
                actual: actualType,
            });
            trackEvent('file_type_checked');
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <div className="space-y-6">
            <FileUpload onFileUpload={handleFile} acceptedMimeTypes={[]} />
            {fileInfo && (
                <div className="p-4 bg-gray-50 border rounded-lg space-y-2">
                    <p><strong>File Name:</strong> {fileInfo.name}</p>
                    <p><strong>Declared Type (from extension):</strong> {fileInfo.declared}</p>
                    <p><strong>Actual Type (from signature):</strong> {fileInfo.actual}</p>
                </div>
            )}
        </div>
    );
};

export default FileTypeChecker;
