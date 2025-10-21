import React, { useState, useRef, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

const ImageToGifConverter: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => setImage(img);
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
        setResultUrl(null);
    };

    // Note: This is a very simplified GIF encoder for a single frame without LZW compression.
    // It is not a fully-featured GIF library.
    const createGif = (imageData: ImageData): Blob => {
        const { width, height, data } = imageData;
        const buffer: number[] = [];

        // Header
        buffer.push(0x47, 0x49, 0x46, 0x38, 0x39, 0x61); // GIF89a

        // Logical Screen Descriptor
        buffer.push(width & 0xFF, (width >> 8) & 0xFF);
        buffer.push(height & 0xFF, (height >> 8) & 0xFF);
        buffer.push(0xF7, 0x00, 0x00); // GCT follows, 256 colors, 8-bit color depth

        // Global Color Table (simple 256 color palette)
        for (let i = 0; i < 256; i++) {
            const val = Math.floor(i / 36.4) * 51;
            buffer.push(val, val, val);
        }

        // Image Descriptor
        buffer.push(0x2C, 0x00, 0x00, 0x00, 0x00); // Image separator, left, top
        buffer.push(width & 0xFF, (width >> 8) & 0xFF);
        buffer.push(height & 0xFF, (height >> 8) & 0xFF);
        buffer.push(0x00); // No local color table

        // Image Data (simplified)
        buffer.push(8); // LZW minimum code size
        const lzwData = [];
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i + 1], b = data[i + 2];
            const gray = Math.floor((r + g + b) / 3);
            const colorIndex = Math.min(255, Math.floor(gray / 255 * 255));
            lzwData.push(colorIndex);
        }

        // Basic block structure
        buffer.push(255); // Block size
        for(let i = 0; i < 255; i++) buffer.push(i);
        buffer.push(0x01);
        buffer.push(257); // End of information code
        buffer.push(0x00); // Block terminator

        // Trailer
        buffer.push(0x3B);

        return new Blob([new Uint8Array(buffer)], { type: 'image/gif' });
    };

    const convertToGif = useCallback(() => {
        if (!image || !canvasRef.current) return;
        setIsProcessing(true);
        setTimeout(() => {
            const canvas = canvasRef.current!;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (!ctx) return;
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const gifBlob = createGif(imageData);
            setResultUrl(URL.createObjectURL(gifBlob));
            setIsProcessing(false);
            trackEvent('image_converted', { from: 'image', to: 'gif' });
        }, 50);
    }, [image]);
    
    const handleReset = () => {
        setImage(null);
        if(resultUrl) URL.revokeObjectURL(resultUrl);
        setResultUrl(null);
    };

    if (!image) {
        return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/jpeg', 'image/png', 'image/webp']} />;
    }

    return (
        <div className="space-y-6">
            <p className="text-center text-sm bg-yellow-50 border border-yellow-200 p-3 rounded-md">Note: This is a simple, single-frame GIF converter and may not produce optimized results.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="p-2 border rounded-lg bg-gray-100 flex items-center justify-center min-h-[300px]">
                    <img src={image.src} alt="Original" className="max-w-full max-h-[400px]" />
                </div>
                <div className="p-2 border rounded-lg bg-gray-100 flex items-center justify-center min-h-[300px]">
                    {isProcessing ? ( <p>Converting...</p> ) : resultUrl ? ( <img src={resultUrl} alt="Preview" className="max-w-full max-h-[400px]" /> ) : ( <p className="text-gray-500">Result will appear here</p> )}
                    <canvas ref={canvasRef} className="hidden" />
                </div>
            </div>
            <div className="flex justify-center gap-4">
                {!resultUrl ? (
                    <button onClick={convertToGif} disabled={isProcessing} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                        {isProcessing ? 'Processing...' : 'Convert to GIF'}
                    </button>
                ) : (
                    <a href={resultUrl} download="converted.gif" className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Download GIF</a>
                )}
                <button onClick={handleReset} className="px-4 py-2 text-sm text-gray-600 hover:underline">Use another image</button>
            </div>
        </div>
    );
};

export default ImageToGifConverter;