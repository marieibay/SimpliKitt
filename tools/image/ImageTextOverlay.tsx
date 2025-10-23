import React, { useState, useRef, useEffect, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent, trackGtagEvent } from '../../analytics';

const ImageTextOverlay: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [text, setText] = useState('Hello World');
    const [fontSize, setFontSize] = useState(48);
    const [fontColor, setFontColor] = useState('#FFFFFF');
    const [position, setPosition] = useState({ x: 50, y: 50 });
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => {
                setImage(img);
                setPosition({ x: img.width / 2, y: img.height / 2 });
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const draw = useCallback(() => {
        if (!image || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = fontColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, position.x, position.y);
        
        setResultUrl(canvas.toDataURL());
    }, [image, text, fontSize, fontColor, position]);
    
    useEffect(() => { draw(); }, [draw]);

    const handleDownload = () => {
        if (!resultUrl) return;
        trackEvent('image_text_overlay_added');
        trackGtagEvent('tool_used', {
            event_category: 'Image Tools',
            event_label: 'Image Text Overlay',
            tool_name: 'image-text-overlay',
            is_download: true,
        });
        const link = document.createElement('a');
        link.href = resultUrl;
        link.download = 'text-overlay.png';
        link.click();
    };
    
    if (!image) {
        return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/*']} />;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2"><canvas ref={canvasRef} className="max-w-full h-auto border rounded-lg" /></div>
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div><label className="text-sm">Text</label><input type="text" value={text} onChange={e => setText(e.target.value)} className="w-full p-2 border-gray-300 rounded-md" /></div>
                <div><label className="text-sm">Font Size: {fontSize}px</label><input type="range" min="12" max="200" value={fontSize} onChange={e => setFontSize(+e.target.value)} className="w-full" /></div>
                <div><label className="text-sm">Font Color</label><input type="color" value={fontColor} onChange={e => setFontColor(e.target.value)} className="w-full h-10 p-1 border rounded-md" /></div>
                <div><label className="text-sm">Position X: {position.x}</label><input type="range" min="0" max={image.width} value={position.x} onChange={e => setPosition(p => ({ ...p, x: +e.target.value }))} className="w-full" /></div>
                <div><label className="text-sm">Position Y: {position.y}</label><input type="range" min="0" max={image.height} value={position.y} onChange={e => setPosition(p => ({ ...p, y: +e.target.value }))} className="w-full" /></div>
                <div className="pt-4 space-y-3">
                    <button onClick={handleDownload} className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Download Image</button>
                    <button onClick={() => setImage(null)} className="w-full text-sm text-blue-600 hover:underline">Use another image</button>
                </div>
            </div>
        </div>
    );
};

export default ImageTextOverlay;