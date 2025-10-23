import React, { useState, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { trackEvent, trackGtagEvent } from '../../analytics';
import { UploadIcon } from '../../components/Icons';

declare global {
  interface Window { JSZip: any; }
}

const BatchFileRenamer: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [prefix, setPrefix] = useState('renamed-');
    const [startNumber, setStartNumber] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const onDrop = (acceptedFiles: File[]) => {
        setFiles(prev => [...prev, ...acceptedFiles]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const newFilenames = useMemo(() => {
        return files.map((file, index) => {
            const extension = file.name.split('.').pop();
            return `${prefix}${startNumber + index}.${extension}`;
        });
    }, [files, prefix, startNumber]);

    const handleRename = async () => {
        if (!window.JSZip) {
            alert("JSZip library not loaded. Please refresh.");
            return;
        }
        setIsProcessing(true);
        const zip = new window.JSZip();
        files.forEach((file, index) => {
            zip.file(newFilenames[index], file);
        });

        const content = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = "renamed-files.zip";
        link.click();
        
        trackEvent('batch_files_renamed', { count: files.length });
        trackGtagEvent('tool_used', {
            event_category: 'File Converters & Utilities',
            event_label: 'Batch File Renamer',
            tool_name: 'batch-file-renamer',
            is_download: true,
            file_count: files.length,
        });
        setIsProcessing(false);
    };
    
    return (
        <div className="space-y-6">
            <div {...getRootProps()} className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                <input {...getInputProps()} />
                <UploadIcon className="w-12 h-12 text-gray-400 mx-auto" />
                <p>Drop files here, or click to select</p>
            </div>
            {files.length > 0 && (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm">Filename Prefix</label>
                            <input type="text" value={prefix} onChange={e => setPrefix(e.target.value)} className="w-full p-2 border rounded" />
                        </div>
                        <div>
                            <label className="text-sm">Start Number</label>
                            <input type="number" value={startNumber} onChange={e => setStartNumber(parseInt(e.target.value) || 1)} className="w-full p-2 border rounded" />
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold">Preview:</h3>
                     <ul className="list-disc list-inside bg-gray-50 p-3 rounded-lg border max-h-48 overflow-y-auto text-sm">
                        {files.map((file, i) => <li key={i}>{file.name} {'->'} {newFilenames[i]}</li>)}
                    </ul>
                    <button onClick={handleRename} disabled={isProcessing} className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                        {isProcessing ? 'Zipping...' : 'Rename & Download ZIP'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default BatchFileRenamer;