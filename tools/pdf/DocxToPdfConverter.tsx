import React, { useState, useRef } from 'react';
import { trackEvent } from '../../analytics';
import { UploadIcon, InfoIcon } from '../../components/Icons';

// Declare global libraries
declare const mammoth: any;
declare const html2pdf: any;

const DocxToPdfConverter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsProcessing(true);
    setHtmlContent(null);
    setError(null);
    
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setHtmlContent(result.value);
      trackEvent('docx_to_html_previewed', { filename: selectedFile.name });
    } catch (err) {
      console.error(err);
      setError('Failed to process DOCX file. It might be corrupted or not a valid .docx file.');
      setFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConvert = () => {
    if (!previewRef.current || !file) return;
    setIsProcessing(true);

    const opt = {
      margin: 0.5,
      filename: `${file.name.replace(/\.docx$/, '')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'avoid-all'] }
    };

    trackEvent('file_converted_downloaded', { from: 'docx-html', to: 'pdf' });
    
    html2pdf().from(previewRef.current).set(opt).save().then(() => {
        setIsProcessing(false);
    });
  };
  
  const handleClear = () => {
      setFile(null);
      setHtmlContent(null);
      setError(null);
      // Reset file input
      const input = document.getElementById('docx-file-input') as HTMLInputElement;
      if (input) input.value = '';
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg">
          <InfoIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
              <p className="font-semibold">How it works:</p>
              <p className="text-sm">This tool preserves most formatting and avoids cutting images across pages. The preview below is a single scroll, but your downloaded PDF will be correctly paginated.</p>
          </div>
      </div>

      {!htmlContent ? (
        <div className="p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors border-gray-300 hover:border-gray-400">
           <label htmlFor="docx-file-input" className="cursor-pointer flex flex-col items-center justify-center space-y-2">
              <UploadIcon className="w-12 h-12 text-gray-400" />
              <p className="text-lg font-semibold text-gray-700">
                {isProcessing ? 'Processing...' : 'Click to select a DOCX file'}
              </p>
              <input 
                id="docx-file-input"
                type="file" 
                accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                onChange={handleFileChange} 
                className="hidden" 
                disabled={isProcessing}
              />
              <p className="text-sm text-gray-500">Your file will be processed in your browser.</p>
           </label>
           {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        </div>
      ) : (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <button 
                  onClick={handleConvert} 
                  disabled={isProcessing} 
                  className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 text-lg transition"
                >
                    {isProcessing ? 'Generating PDF...' : 'Download as PDF'}
                </button>
                 <button 
                  onClick={handleClear} 
                  disabled={isProcessing} 
                  className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                    Convert another file
                </button>
            </div>
            
            <style>{`
                .docx-preview-content img,
                .docx-preview-content figure,
                .docx-preview-content table,
                .docx-preview-content h1,
                .docx-preview-content h2,
                .docx-preview-content h3 {
                    page-break-inside: avoid !important;
                }
            `}</style>

            <div className="bg-gray-700 p-8 rounded-lg shadow-inner">
                 <h2 className="text-xl font-semibold text-center mb-4 text-white">Document Preview</h2>
                <div 
                    ref={previewRef}
                    className="bg-white rounded shadow-lg mx-auto prose lg:prose-xl docx-preview-content"
                    style={{ width: '8.5in', padding: '1in', minHeight: '11in' }}
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
            </div>
        </div>
      )}
    </div>
  );
};

export default DocxToPdfConverter;