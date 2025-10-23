import React, { useState } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent, trackGtagEvent } from '../../analytics';

const ImageToDataUrlGenerator: React.FC = () => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      setDataUrl(result);
      trackEvent('image_to_data_url_converted', { filename: file.name, size: file.size });
      trackGtagEvent('tool_used', {
        event_category: 'Image Tools',
        event_label: 'Image to Data URL Generator',
        tool_name: 'image-to-data-url-generator',
      });
    };
    reader.readAsDataURL(file);
  };
  
  const handleCopy = () => {
    if (!dataUrl) return;
    navigator.clipboard.writeText(dataUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleReset = () => {
      setDataUrl(null);
      setImagePreview(null);
  }

  return (
    <div className="space-y-6">
      {!imagePreview && (
        <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']} title="Upload an Image to get Data URL" />
      )}

      {imagePreview && dataUrl && (
        <div>
            <h3 className="text-lg font-semibold mb-2">Image Preview</h3>
            <img src={imagePreview} className="max-w-xs rounded-lg border mb-4" alt="Uploaded preview" />

            <div>
                <label htmlFor="data-url-output" className="block text-sm font-medium text-gray-700 mb-1">
                    Data URL
                </label>
                <div className="relative">
                <textarea
                    id="data-url-output"
                    rows={8}
                    readOnly
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                    value={dataUrl}
                />
                <button onClick={handleCopy} className="absolute top-2 right-2 px-3 py-1 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300">
                    {copied ? 'Copied!' : 'Copy'}
                </button>
                </div>
            </div>

            <button onClick={handleReset} className="mt-4 text-sm text-blue-600 hover:underline">
                Convert another image
            </button>
        </div>
      )}
    </div>
  );
};

export default ImageToDataUrlGenerator;