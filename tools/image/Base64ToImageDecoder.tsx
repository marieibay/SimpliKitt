import React, { useState } from 'react';
import { trackEvent } from '../../analytics';

const Base64ToImageDecoder: React.FC = () => {
    const [base64, setBase64] = useState('');
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [error, setError] = useState('');

    const handleDecode = () => {
        if (!base64.startsWith('data:image')) {
            setError('Invalid Data URL. It must start with "data:image...".');
            setImageSrc(null);
            return;
        }
        setError('');
        setImageSrc(base64);
        trackEvent('base64_to_image_decoded');
    };

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base64 Data URL</label>
                <textarea
                    rows={8}
                    value={base64}
                    onChange={e => setBase64(e.target.value)}
                    className="w-full p-3 border rounded-lg font-mono text-sm"
                    placeholder="Paste your data:image/... string here"
                />
            </div>
            <button onClick={handleDecode} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Decode Image</button>
            {error && <p className="text-red-600">{error}</p>}
            {imageSrc && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Decoded Image</h3>
                    <img src={imageSrc} alt="Decoded" className="max-w-full h-auto border rounded-lg" />
                    <a href={imageSrc} download="decoded-image.png" className="inline-block px-5 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Download Image</a>
                </div>
            )}
        </div>
    );
};

export default Base64ToImageDecoder;
