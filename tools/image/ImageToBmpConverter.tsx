import React, { useState, useRef, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

const ImageToBmpConverter: React.FC = () => {
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
    
    // Custom BMP encoder
    const createBmp = (imageData: ImageData): Blob => {
        const { width, height, data } = imageData;
        const rowPadding = (4 - (width * 3) % 4) % 4;
        const rowSize = width * 3 + rowPadding;
        const pixelDataSize = rowSize * height;
        const headerSize = 54;
        const fileSize = headerSize + pixelDataSize;

        const buffer = new ArrayBuffer(fileSize);
        const view = new DataView(buffer);

        // BITMAPFILEHEADER (14 bytes)
        view.setUint16(0, 0x424D, false); // 'BM'
        view.setUint32(2, fileSize, true);
        view.setUint32(10, headerSize, true);

        // BITMAPINFOHEADER (40 bytes)
        view.setUint32(14, 40, true);
        view.setInt32(18, width, true);
        view.setInt32(22, height, true);
        view.setUint16(26, 1, true); // Planes
        view.setUint16(28, 24, true); // Bits per pixel
        view.setUint32(30, 0, true); // Compression
        view.setUint32(34, pixelDataSize, true);
        view.setInt32(38, 2835, true); // X pixels per meter
        view.setInt32(42, 2835, true); // Y pixels per meter
        
        let offset = headerSize;
        for (let y = height - 1; y >= 0; y--) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                view.setUint8(offset++, data[i + 2]); // Blue
                view.setUint8(offset++, data[i + 1]); // Green
                view.setUint8(offset++, data[i]);     // Red
            }
            for (let i = 0; i < rowPadding; i++) {
                view.setUint8(offset++, 0);
            }
        }

        return new Blob([buffer], { type: 'image/bmp' });
    };

    const convertToBmp = useCallback(() => {
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
            const bmpBlob = createBmp(imageData);
            setResultUrl(URL.createObjectURL(bmpBlob));
            setIsProcessing(false);
            trackEvent('image_converted', { from: 'image', to: 'bmp' });
        }, 50);
    }, [image]);

    const handleReset = () => {
        setImage(null);
        if (resultUrl) URL.revokeObjectURL(resultUrl);
        setResultUrl(null);
    };

    if (!image) {
        return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/jpeg', 'image/png', 'image/webp']} />;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="p-2 border rounded-lg bg-gray-100 flex items-center justify-center min-h-[300px]">
                    <img src={image.src} alt="Original" className="max-w-full max-h-[400px]" />
                </div>
                <div className="p-2 border rounded-lg bg-gray-100 flex items-center justify-center min-h-[300px]">
                    {isProcessing ? ( <p>Converting...</p> ) : resultUrl ? ( <img src={image.src} alt="Preview" className="max-w-full max-h-[400px]" /> ) : ( <p className="text-gray-500">Result will appear here</p> )}
                    <canvas ref={canvasRef} className="hidden" />
                </div>
            </div>
            <div className="flex justify-center gap-4">
                {!resultUrl ? (
                    <button onClick={convertToBmp} disabled={isProcessing} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                        {isProcessing ? 'Processing...' : 'Convert to BMP'}
                    </button>
                ) : (
                    <a href={resultUrl} download="converted.bmp" className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Download BMP</a>
                )}
                <button onClick={handleReset} className="px-4 py-2 text-sm text-gray-600 hover:underline">Use another image</button>
            </div>
        </div>
    );
};

export default ImageToBmpConverter;