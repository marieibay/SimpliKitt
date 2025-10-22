
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { trackGtagEvent } from '../../analytics';
import { UploadIcon } from '../../components/Icons';

const FileMerger: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [mergedContent, setMergedContent] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const onDrop = (acceptedFiles: File[]) => {
        setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'text/plain': ['.txt'], 'text/csv': ['.csv'] },
    });

    const handleMerge = async () => {
        if (files.length < 2) {
            alert("Please select at least two files to merge.");
            return;
        }
        setIsProcessing(true);
        let content = '';
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const text = await file.text();
            content += text;
            if (i < files.length - 1) {
                content += '\n\n';
            }
        }
        setMergedContent(content);
        setIsProcessing(false);
    };

    const handleDownload = () => {
        if (!mergedContent) return;
        trackGtagEvent('tool_used', {
            event_category: 'File Converters & Utilities',
            event_label: 'File Merger (Text/CSV)',
            tool_name: 'file-merger-textcsv',
            is_download: true,
            file_count: files.length
        });
        const blob = new Blob([mergedContent], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'merged-file.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleReset = () => {
        setFiles([]);
        setMergedContent(null);
    };

    return (
        <div className="space-y-6">
            {!mergedContent ? (
                <>
                    <div {...getRootProps()} className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}>
                        <input {...getInputProps()} />
                        <UploadIcon className="w-12 h-12 text-gray-400 mx-auto" />
                        <p className="mt-2 text-lg font-semibold text-gray-700">Drop your text or CSV files here, or click</p>
                        <p className="text-sm text-gray-500">Select multiple files to merge</p>
                    </div>
                    {files.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="font-semibold">Selected Files ({files.length}):</h3>
                            <ul className="list-disc list-inside bg-gray-50 p-3 rounded-lg border max-h-48 overflow-y-auto">
                                {files.map((file, index) => (
                                    <li key={index} className="text-sm text-gray-700 truncate">{file.name}</li>
                                ))}
                            </ul>
                            <div className="text-center pt-4">
                                <button onClick={handleMerge} disabled={isProcessing || files.length < 2} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300">
                                    {isProcessing ? 'Merging...' : `Merge ${files.length} Files`}
                                </button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center space-y-4">
                    <h3 className="text-xl font-bold text-gray-800">Files Merged Successfully!</h3>
                    <p className="text-gray-600">Your combined file is ready for download.</p>
                    <button onClick={handleDownload} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">Download Merged File</button>
                    <button onClick={handleReset} className="ml-4 text-sm text-blue-600 hover:underline">Start Over</button>
                </div>
            )}
        </div>
    );
};

export default FileMerger;
