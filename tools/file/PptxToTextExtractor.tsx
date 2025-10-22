import React, { useState } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

declare global {
    interface Window { PptxGenJS: any; }
}

const PptxToTextExtractor: React.FC = () => {
    const [text, setText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const handleFile = (file: File) => {
        // This is a placeholder as client-side PPTX text extraction is very complex.
        // A full implementation would require a library like pptx-js or a similar parser.
        // For now, we show a message.
        setError("PPTX text extraction is a complex feature and is currently a placeholder. A full implementation would require a dedicated library.");
        trackEvent('pptx_text_extraction_attempted');
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['application/vnd.openxmlformats-officedocument.presentationml.presentation']} />
            {isProcessing && <p>Extracting text...</p>}
            {error && <p className="p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg text-sm">{error}</p>}
            {text && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">Extracted Text</h3>
                    <div className="relative">
                        <textarea readOnly value={text} rows={15} className="w-full p-2 border rounded bg-gray-50" />
                        <button onClick={handleCopy} className="absolute top-2 right-2 px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300">
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PptxToTextExtractor;
