import React, { useState } from 'react';
import { trackEvent } from '../../analytics';

const Base64ToImageDecoder: React.FC = () => {
    const [base64Input, setBase64Input] = useState('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [fileName, setFileName] = useState('decoded-image.png');

    const handleDecode = () => {
        if (!base64Input.trim()) {
            setError("Input cannot be empty.");
            return;
        }

        try {
            // Basic validation
            const match = base64Input.match(/^data:(image\/(\w+));base64,/);
            if (!match) {
                throw new Error("Invalid Data URL format. Must start with 'data:image/...;base64,'");
            }
            
            const mimeType = match[1];
            const extension = match[2] || 'png';
            
            // The browser can handle the Data URL directly
            setImageUrl(base64Input);
            setFileName(`decoded-image.${extension}`);
            setError(null);
            trackEvent('base64_to_image_decoded');
        } catch (e: any) {
            setError(e.message || "Failed to decode Base64 string.");
            setImageUrl(null);
        }
    };
    
    const handleReset = () => {
        setBase64Input('');
        setImageUrl(null);
        setError(null);
    };

    return (
        <div className="space-y-6">
            <div>
                <label htmlFor="base64-input" className="block text-sm font-medium text-gray-700 mb-1">Base64 Data URL</label>
                <textarea
                    id="base64-input"
                    rows={8}
                    className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm"
                    placeholder="data:image/png;base64,iVBORw0KGgoAAA..."
                    value={base64Input}
                    onChange={e => setBase64Input(e.target.value)}
                />
            </div>

            {error && <p className="text-red-600 text-center">{error}</p>}

            <div className="flex justify-center gap-4">
                <button onClick={handleDecode} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Decode Image</button>
                <button onClick={handleReset} className="text-sm text-gray-600 hover:underline">Clear</button>
            </div>

            {imageUrl && (
                <div className="text-center space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-semibold">Decoded Image</h3>
                    <div className="flex justify-center p-2 bg-gray-100 border rounded-lg">
                        <img src={imageUrl} alt="Decoded" className="max-w-full max-h-80" />
                    </div>
                    <a href={imageUrl} download={fileName} className="inline-block px-5 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">
                        Download Image
                    </a>
                </div>
            )}
        </div>
    );
};

export default Base64ToImageDecoder;
