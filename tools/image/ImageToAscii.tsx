import React, { useState, useRef, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

const ASCII_CHARS_DENSE = ['@', '%', '#', '*', '+', '=', '-', ':', '.', ' '];
const ASCII_CHARS_SIMPLE = ['#', 'A', 'O', 'x', 'o', ';', ':', '.', ' '];

const ImageToAscii: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [asciiArt, setAsciiArt] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [detail, setDetail] = useState(120); // Corresponds to width
    const [charSet, setCharSet] = useState<'dense' | 'simple'>('dense');
    const [copied, setCopied] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => setImage(img);
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
        setAsciiArt(null);
    };

    const convertToAscii = useCallback(() => {
        if (!image || !canvasRef.current) return;
        setIsProcessing(true);

        setTimeout(() => {
            const canvas = canvasRef.current!;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (!ctx) return;

            const aspectRatio = image.height / image.width;
            const newWidth = detail;
            const newHeight = Math.floor(newWidth * aspectRatio * 0.5); // Adjust for character aspect ratio

            canvas.width = newWidth;
            canvas.height = newHeight;
            ctx.drawImage(image, 0, 0, newWidth, newHeight);

            const imageData = ctx.getImageData(0, 0, newWidth, newHeight);
            const data = imageData.data;
            const chars = charSet === 'dense' ? ASCII_CHARS_DENSE : ASCII_CHARS_SIMPLE;
            const charLen = chars.length;
            
            let ascii = '';
            for (let y = 0; y < newHeight; y++) {
                for (let x = 0; x < newWidth; x++) {
                    const offset = (y * newWidth + x) * 4;
                    const r = data[offset];
                    const g = data[offset + 1];
                    const b = data[offset + 2];
                    const brightness = (0.299 * r + 0.587 * g + 0.114 * b);
                    const charIndex = Math.floor((brightness / 255) * (charLen - 1));
                    ascii += chars[charLen - 1 - charIndex];
                }
                ascii += '\n';
            }
            setAsciiArt(ascii);
            setIsProcessing(false);
            trackEvent('image_to_ascii_converted', { detail, charSet });
        }, 50);

    }, [image, detail, charSet]);

    const handleCopy = () => {
        if (!asciiArt) return;
        navigator.clipboard.writeText(asciiArt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        if (!asciiArt) return;
        const blob = new Blob([asciiArt], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ascii-art.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleReset = () => {
        setImage(null);
        setAsciiArt(null);
    };

    if (!image) {
        return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/jpeg', 'image/png', 'image/webp']} />;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 p-4 bg-gray-50 border rounded-lg">
                    <label className="block text-sm font-medium">Detail Level: {detail}px wide</label>
                    <input type="range" min="40" max="200" step="10" value={detail} onChange={e => setDetail(parseInt(e.target.value, 10))} className="w-full" />
                </div>
                <div className="space-y-2 p-4 bg-gray-50 border rounded-lg">
                    <label className="block text-sm font-medium">Character Set</label>
                    <select value={charSet} onChange={e => setCharSet(e.target.value as any)} className="w-full p-2 border-gray-300 rounded-md">
                        <option value="dense">Dense</option>
                        <option value="simple">Simple</option>
                    </select>
                </div>
            </div>
            
            <div className="flex justify-center gap-4">
                <button onClick={convertToAscii} disabled={isProcessing} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                    {isProcessing ? 'Generating...' : 'Generate ASCII Art'}
                </button>
                 <button onClick={handleReset} className="text-sm text-gray-600 hover:underline">
                    Use another image
                </button>
            </div>

            {asciiArt && (
                <div className="space-y-4">
                    <div className="relative">
                        <pre className="text-xs font-mono p-4 bg-gray-800 text-white rounded-lg max-h-96 overflow-auto leading-tight tracking-tighter">
                            {asciiArt}
                        </pre>
                    </div>
                    <div className="flex justify-center gap-4">
                        <button onClick={handleCopy} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                            {copied ? 'Copied!' : 'Copy to Clipboard'}
                        </button>
                        <button onClick={handleDownload} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                            Download as .txt
                        </button>
                    </div>
                </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
};

export default ImageToAscii;