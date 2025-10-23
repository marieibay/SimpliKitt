import React, { useState } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent, trackGtagEvent } from '../../analytics';

declare global {
    interface Window { mammoth: any; }
}

const DocxToTextExtractor: React.FC = () => {
    const [text, setText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const handleFile = (file: File) => {
        if (!window.mammoth) {
            setError("Mammoth.js library not loaded. Please refresh.");
            return;
        }
        setIsProcessing(true);
        setError('');
        const reader = new FileReader();
        reader.onload = (e) => {
            window.mammoth.extractRawText({ arrayBuffer: e.target!.result })
                .then((result: any) => {
                    setText(result.value);
                    trackEvent('docx_text_extracted');
                    trackGtagEvent('tool_used', {
                        event_category: 'File Converters & Utilities',
                        event_label: 'DOCX to Text Extractor',
                        tool_name: 'docx-to-text-extractor',
                        is_download: false,
                    });
                })
                .catch((err: any) => {
                    setError("Could not extract text from DOCX.");
                    console.error(err);
                })
                .finally(() => setIsProcessing(false));
        };
        reader.readAsArrayBuffer(file);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['application/vnd.openxmlformats-officedocument.wordprocessingml.document']} />
            {isProcessing && <p>Extracting text...</p>}
            {error && <p className="text-red-500">{error}</p>}
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

export default DocxToTextExtractor;