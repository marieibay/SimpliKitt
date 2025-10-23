import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import FileUpload from '../../components/FileUpload';
import { trackEvent, trackGtagEvent } from '../../analytics';

const SplitPdf: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageRange, setPageRange] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);

  const handleFile = async (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setPageRange('');
    setIsProcessing(true);
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      setTotalPages(pdf.getPageCount());
    } catch (err) {
      setError("Could not read the PDF. It might be corrupted or encrypted.");
      setFile(null);
      setTotalPages(0);
    } finally {
        setIsProcessing(false);
    }
  };

  const handleSplit = async () => {
    if (!file || !pageRange) {
      setError("Please select a file and enter a page range.");
      return;
    }
    setIsProcessing(true);
    setError(null);

    try {
      // Parse page range string (e.g., "1-3, 5, 8-10") into an array of 0-based indices
      const pageIndices = pageRange
        .split(',')
        .flatMap(r => {
          const trimmed = r.trim();
          if (trimmed.includes('-')) {
            const parts = trimmed.split('-').map(s => parseInt(s, 10));
            if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]) && parts[0] <= parts[1]) {
              const [start, end] = parts;
              return Array.from({ length: end - start + 1 }, (_, i) => start + i - 1);
            }
            return [];
          }
          const num = parseInt(trimmed, 10);
          return !isNaN(num) ? [num - 1] : [];
        })
        .filter(i => i >= 0 && i < totalPages);
      
      const uniqueIndices = [...new Set(pageIndices)].sort((a: number, b: number) => a - b);

      if (uniqueIndices.length === 0) {
        setError("Invalid or empty page range specified.");
        setIsProcessing(false);
        return;
      }

      const arrayBuffer = await file.arrayBuffer();
      const originalPdf = await PDFDocument.load(arrayBuffer);
      
      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(originalPdf, uniqueIndices);
      copiedPages.forEach(page => newPdf.addPage(page));
      
      const newPdfBytes = await newPdf.save();
      const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `extracted-${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      trackEvent('pdf_pages_extracted', {
        pageRange,
        totalPages,
        extractedPageCount: uniqueIndices.length,
      });
      trackGtagEvent('tool_used', {
        event_category: 'PDF & Document Tools',
        event_label: 'Extract PDF Pages',
        tool_name: 'extract-pdf-pages',
        is_download: true,
        extracted_pages: uniqueIndices.length,
      });

    } catch (err) {
      setError("An error occurred while splitting the PDF. Please check the file and page range.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPageRange('');
    setError(null);
    setTotalPages(0);
  };

  return (
    <div className="space-y-6">
      {!file && !isProcessing && (
        <FileUpload 
          onFileUpload={handleFile}
          acceptedMimeTypes={['application/pdf']}
          title="Upload a PDF to Split"
        />
      )}

      {isProcessing && !totalPages && (
         <div className="text-center p-8 border-2 border-dashed rounded-lg">
            <p className="text-lg font-semibold text-gray-700">Reading your PDF...</p>
        </div>
      )}

      {file && totalPages > 0 && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 border rounded-lg">
            <p className="font-semibold text-gray-800">{file.name}</p>
            <p className="text-sm text-gray-600">Total Pages: {totalPages}</p>
          </div>
          <div>
            <label htmlFor="page-range" className="block text-sm font-medium text-gray-700 mb-1">
              Pages to Extract
            </label>
            <input
              type="text"
              id="page-range"
              value={pageRange}
              onChange={e => setPageRange(e.target.value)}
              placeholder="e.g., 1-3, 5, 8-10"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
                Enter page numbers or ranges separated by commas.
            </p>
          </div>
          
          {error && <p className="text-center text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

          <div className="flex justify-center items-center gap-4 pt-4 border-t">
            <button
              onClick={handleSplit}
              disabled={isProcessing || !pageRange}
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300"
            >
              {isProcessing ? 'Extracting...' : 'Extract Pages & Download'}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm text-gray-600 hover:underline"
            >
              Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SplitPdf;