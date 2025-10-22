
import React, { useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import { trackGtagEvent } from '../../analytics';
import { UploadIcon } from '../../components/Icons';

const MergePdf: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Drag and drop state
    // FIX: Initialize useRef with an initial value.
    const dragItem = useRef<number | undefined>(undefined);
    const dragOverItem = useRef<number | undefined>(undefined);

    const onDrop = (acceptedFiles: File[]) => {
        setFiles(prevFiles => [...prevFiles, ...acceptedFiles.filter(f => f.type === 'application/pdf')]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
    });
    
    const handleMerge = async () => {
        if (files.length < 2) {
            setError("Please select at least two PDF files to merge.");
            return;
        }
        setIsProcessing(true);
        setError(null);

        try {
            const mergedPdf = await PDFDocument.create();
            for (const file of files) {
                const pdfBytes = await file.arrayBuffer();
                const pdf = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach(page => mergedPdf.addPage(page));
            }

            const mergedPdfBytes = await mergedPdf.save();
            
            trackGtagEvent('tool_used', {
                event_category: 'PDF & Document Tools',
                event_label: 'Merge PDF',
                tool_name: 'merge-pdf',
                is_download: true,
                file_count: files.length,
            });

            const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'merged.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            setFiles([]); // Reset after successful merge
        } catch (err) {
            console.error(err);
            setError("An error occurred while merging PDFs. One or more files may be corrupted or encrypted.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRemoveFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleDragSort = () => {
        const _files = [...files];
        const dragItemContent = _files.splice(dragItem.current!, 1)[0];
        _files.splice(dragOverItem.current!, 0, dragItemContent);
        dragItem.current = undefined;
        dragOverItem.current = undefined;
        setFiles(_files);
    };

    return (
        <div className="space-y-6">
            <div {...getRootProps()} className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}>
                <input {...getInputProps()} />
                <UploadIcon className="w-12 h-12 text-gray-400 mx-auto" />
                <p className="mt-2 text-lg font-semibold text-gray-700">Drop PDF files here or click to select</p>
                <p className="text-sm text-gray-500">Add two or more files to merge</p>
            </div>

            {error && <p className="text-red-600 text-center">{error}</p>}

            {files.length > 0 && (
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Files to Merge ({files.length}):</h3>
                     <p className="text-sm text-gray-500">Drag and drop files in the list below to reorder them.</p>
                    <ul className="space-y-2 max-h-60 overflow-y-auto p-2 border rounded-lg bg-gray-50">
                        {files.map((file, index) => (
                            <li 
                                key={index} 
                                className="flex items-center justify-between bg-white p-3 border rounded shadow-sm cursor-grab"
                                draggable
                                onDragStart={() => dragItem.current = index}
                                onDragEnter={() => dragOverItem.current = index}
                                onDragEnd={handleDragSort}
                                onDragOver={(e) => e.preventDefault()}
                            >
                                <span className="text-sm truncate">{file.name}</span>
                                <button onClick={() => handleRemoveFile(index)} className="text-red-500 hover:text-red-700 text-sm font-bold ml-4">X</button>
                            </li>
                        ))}
                    </ul>
                    <div className="text-center pt-4">
                        <button onClick={handleMerge} disabled={isProcessing || files.length < 2} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300">
                            {isProcessing ? 'Merging...' : 'Merge PDFs & Download'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MergePdf;
