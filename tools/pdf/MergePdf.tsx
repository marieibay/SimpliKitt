import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { MergePdfIcon } from '../../components/Icons';
import { trackEvent } from '../../analytics';

const MergePdf: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const draggedItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // FIX: Add explicit type to 'file' parameter to resolve type inference issue.
      const selectedFiles = Array.from(e.target.files).filter(
        (file: File) => file.type === 'application/pdf'
      );
      if (selectedFiles.length !== e.target.files.length) {
          setError("Some files were not PDFs and have been ignored.");
      } else {
          setError(null);
      }
      setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    }
  };

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
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'merged.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      trackEvent('pdfs_merged', { fileCount: files.length });

    } catch (err) {
      setError("An error occurred while merging the PDFs. Please ensure they are valid and not encrypted.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleDragSort = () => {
    if (draggedItem.current === null || dragOverItem.current === null) return;
    const newFiles = [...files];
    const draggedFile = newFiles.splice(draggedItem.current, 1)[0];
    newFiles.splice(dragOverItem.current, 0, draggedFile);
    draggedItem.current = null;
    dragOverItem.current = null;
    setFiles(newFiles);
  };
  
  const handleRemoveFile = (index: number) => {
      setFiles(files.filter((_, i) => i !== index));
  }

  const handleReset = () => {
      setFiles([]);
      setError(null);
      setIsProcessing(false);
  }

  return (
    <div className="space-y-6">
        <div className="p-8 border-2 border-dashed rounded-lg text-center bg-gray-50">
            <label htmlFor="pdf-input" className="cursor-pointer">
                <MergePdfIcon className="w-12 h-12 text-gray-400 mx-auto" />
                <h3 className="text-lg font-semibold text-gray-700 mt-2">Select PDF Files</h3>
                <p className="text-sm text-gray-500">Drag and drop files to reorder them for merging.</p>
                <input
                    id="pdf-input"
                    type="file"
                    multiple
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </label>
            <button onClick={() => document.getElementById('pdf-input')?.click()} className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                Add PDFs
            </button>
        </div>

        {files.length > 0 && (
            <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Files to Merge ({files.length}):</h3>
                <ul className="space-y-2">
                    {files.map((file, index) => (
                        <li
                            key={index}
                            draggable
                            onDragStart={() => (draggedItem.current = index)}
                            onDragEnter={() => (dragOverItem.current = index)}
                            onDragEnd={handleDragSort}
                            onDragOver={(e) => e.preventDefault()}
                            className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm cursor-grab"
                        >
                            <div className="flex items-center space-x-3">
                                <span className="text-gray-500">{index + 1}.</span>
                                <span className="font-medium text-gray-700">{file.name}</span>
                            </div>
                            <button onClick={() => handleRemoveFile(index)} className="text-gray-400 hover:text-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        )}

        {error && <p className="text-center text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

        {files.length > 0 && (
            <div className="flex justify-center items-center gap-4 pt-4 border-t">
                <button
                    onClick={handleMerge}
                    disabled={isProcessing || files.length < 2}
                    className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition disabled:bg-green-300"
                >
                    {isProcessing ? 'Merging...' : `Merge ${files.length} PDFs`}
                </button>
                <button
                    onClick={handleReset}
                    className="px-4 py-2 text-sm text-gray-600 hover:underline"
                >
                    Reset
                </button>
            </div>
        )}
    </div>
  );
};

export default MergePdf;