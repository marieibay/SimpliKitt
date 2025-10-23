import React, { useState } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent, trackGtagEvent } from '../../analytics';

const FileExtensionChanger: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [newExtension, setNewExtension] = useState('.log');

    const handleFile = (selectedFile: File) => {
        setFile(selectedFile);
    };

    const handleChangeAndDownload = () => {
        if (!file) return;
        
        const originalName = file.name;
        const baseName = originalName.includes('.') ? originalName.substring(0, originalName.lastIndexOf('.')) : originalName;
        const newName = `${baseName}${newExtension}`;

        const blob = file.slice(0, file.size, file.type);
        const newFile = new File([blob], newName, { type: file.type });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(newFile);
        link.download = newName;
        link.click();
        
        trackEvent('file_extension_changed');
        trackGtagEvent('tool_used', {
            event_category: 'File Converters & Utilities',
            event_label: 'File Extension Changer',
            tool_name: 'file-extension-changer',
            is_download: true,
            new_extension: newExtension,
        });
    };

    if (!file) {
        return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={[]} />;
    }

    return (
        <div className="space-y-4">
            <p>Selected file: <strong>{file.name}</strong></p>
            <div className="flex items-center gap-4">
                <label className="text-sm">New Extension:</label>
                <input type="text" value={newExtension} onChange={e => setNewExtension(e.target.value)} className="p-2 border rounded-md" placeholder=".txt" />
            </div>
            <button onClick={handleChangeAndDownload} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Change & Download</button>
             <button onClick={() => setFile(null)} className="ml-4 text-sm text-blue-600 hover:underline">Use another file</button>
        </div>
    );
};

export default FileExtensionChanger;