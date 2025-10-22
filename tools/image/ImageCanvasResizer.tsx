import React, { useState, useRef, useEffect, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

const ImageCanvasResizer: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [dims, setDims] = useState({ width: 0, height: 0 });
    const [bgColor, setBgColor] = useState('#ffffff');
    const [resultUrl, setResultUrl] = useState('');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => {
                setImage(img);
                setDims({ width: img.width, height: img.height });
            };
            img.src = e.target!.result as string;
        };
        reader.readAsDataURL(file);
    };

    const draw = useCallback(() => {
        if (!image || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        canvas.width = dims.width;
        canvas.height = dims.height;
        
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const x = (canvas.width - image.width) / 2;
        const y = (canvas.height - image.height) / 2;
        ctx.drawImage(image, x, y);
        
        setResultUrl(canvas.toDataURL());
    }, [image, dims, bgColor]);
    
    useEffect(() => { draw() }, [draw]);

    const handleDownload = () => {
        trackEvent('image_canvas_resized');
        const link = document.createElement('a');
        link.href = resultUrl;
        link.download = 'canvas-resized.png';
        link.click();
    };

    if (!image) return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/*']} />;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2"><canvas ref={canvasRef} className="max-w-full h-auto border rounded-lg bg-gray-100" /></div>
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <p className="text-sm">Original: {image.width}x{image.height}</p>
                <div><label className="text-sm">Width</label><input type="number" value={dims.width} onChange={e => setDims(d => ({...d, width: +e.target.value}))} className="w-full p-2 border-gray-300 rounded-md" /></div>
                <div><label className="text-sm">Height</label><input type="number" value={dims.height} onChange={e => setDims(d => ({...d, height: +e.target.value}))} className="w-full p-2 border-gray-300 rounded-md" /></div>
                <div><label className="text-sm">Background Color</label><input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-full h-10 p-1 border rounded-md" /></div>
                <button onClick={handleDownload} className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Download</button>
            </div>
        </div>
    );
};

export default ImageCanvasResizer;
