import React, { useState } from 'react';
import { FileMergerIcon } from '../../components/Icons';
import { trackEvent } from '../../analytics';

const FileMerger: React.FC = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [mergedContent, setMergedContent] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
      setMergedContent(null);
      setError(null);
    }
  };

  const handleMerge = async () => {
    if (!files || files.length === 0) {
      setError("Please select at least one file.");
      return;
    }
    if (files.length === 1) {
      setError("Please select more than one file to merge.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    let content = '';
    // FIX: Add explicit type to 'file' parameter to resolve type inference issue.
    const readPromises = Array.from(files).map((file: File) => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target?.result as string);
            // FIX: Reject with reader.error instead of the ProgressEvent.
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    });

    try {
        const fileContents = await Promise.all(readPromises);
        content = fileContents.join('\n\n'); // Add blank lines between files
        setMergedContent(content);
        trackEvent('files_merged', { fileCount: files.length });
    } catch (err) {
        setError("Error reading one of the files.");
        console.error(err);
    }
    setIsProcessing(false);
  };
  
  const handleDownload = () => {
    if (!mergedContent) return;
    const blob = new Blob([mergedContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'merged-file.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleReset = () => {
    setFiles(null);
    setMergedContent(null);
    setError(null);
    // This is a common way to reset a file input
    const input = document.getElementById('file-input') as HTMLInputElement;
    if (input) input.value = '';
  }

  return (
    <div className="space-y-6">
      {!mergedContent && (
        <div className="text-center space-y-4 p-6 bg-gray-50 border-2 border-dashed rounded-lg">
            <label htmlFor="file-input" className="cursor-pointer">
                <FileMergerIcon className="w-12 h-12 text-gray-400 mx-auto" />
                <h3 className="text-lg font-semibold text-gray-700 mt-2">Select Files to Merge</h3>
                <p className="text-sm text-gray-500">Supports .txt and .csv files</p>
            </label>
            <input 
                id="file-input"
                type="file" 
                multiple 
                onChange={handleFileChange}
                accept=".txt,.csv"
                className="hidden"
            />
            {files && files.length > 0 && (
                <div className="text-sm text-gray-600">
                    {files.length} file(s) selected
                </div>
            )}
            <button
                onClick={handleMerge}
                disabled={!files || isProcessing}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300"
            >
                {isProcessing ? 'Merging...' : 'Merge Files'}
            </button>
        </div>
      )}

      {error && (
        <div className="text-center p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <p>{error}</p>
        </div>
      )}
      
      {mergedContent && (
        <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Merge Successful!</h3>
            <p className="text-gray-600">{files?.length} files were combined.</p>
            <div className="flex justify-center gap-4">
                <button 
                    onClick={handleDownload}
                    className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                >
                    Download Merged File
                </button>
                 <button 
                    onClick={handleReset}
                    className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
                >
                    Start Over
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default FileMerger;