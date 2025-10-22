import React, { useState, useMemo } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

const ImageToCssBackground: React.FC = () => {
    const [dataUrl, setDataUrl] = useState('');
    const [size, setSize] = useState('cover');
    const [repeat, setRepeat] = useState('no-repeat');
    const [copied, setCopied] = useState(false);

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = e => {
            setDataUrl(e.target?.result as string);
            trackEvent('css_background_generated');
        };
        reader.readAsDataURL(file);
    };

    const cssCode = useMemo(() => {
        if (!dataUrl) return '';
        return `
.background-image {
  background-image: url("${dataUrl}");
  background-size: ${size};
  background-repeat: ${repeat};
  background-position: center center;
}
        `.trim();
    }, [dataUrl, size, repeat]);

    const handleCopy = () => {
        if (!cssCode) return;
        navigator.clipboard.writeText(cssCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!dataUrl) {
        return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml']} />;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 border rounded-lg space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Background Size</label>
                        <select value={size} onChange={e => setSize(e.target.value)} className="w-full p-2 mt-1 border-gray-300 rounded-md">
                            <option value="cover">Cover</option>
                            <option value="contain">Contain</option>
                            <option value="auto">Auto</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Background Repeat</label>
                        <select value={repeat} onChange={e => setRepeat(e.target.value)} className="w-full p-2 mt-1 border-gray-300 rounded-md">
                            <option value="no-repeat">No Repeat</option>
                            <option value="repeat">Repeat</option>
                            <option value="repeat-x">Repeat X</option>
                            <option value="repeat-y">Repeat Y</option>
                        </select>
                    </div>
                </div>
                <div className="p-4 bg-gray-100 border rounded-lg flex items-center justify-center" style={{ backgroundImage: `url(${dataUrl})`, backgroundSize: size, backgroundRepeat: repeat, backgroundPosition: 'center' }} />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Generated CSS</label>
                <div className="relative">
                    <pre className="p-4 bg-gray-800 text-white rounded-lg overflow-auto text-sm">
                        <code>{cssCode}</code>
                    </pre>
                    <button onClick={handleCopy} className="absolute top-2 right-2 px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-500">
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
            </div>
             <button onClick={() => setDataUrl('')} className="text-sm text-blue-600 hover:underline">Use another image</button>
        </div>
    );
};

export default ImageToCssBackground;
