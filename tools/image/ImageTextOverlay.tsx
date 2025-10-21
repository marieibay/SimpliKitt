import React, { useState, useRef, useEffect, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

const WEBSAFE_FONTS = ['Arial', 'Verdana', 'Georgia', 'Times New Roman', 'Courier New', 'Impact'];

const ImageTextOverlay: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [text, setText] = useState('Hello World');
    const [textPos, setTextPos] = useState({ x: 50, y: 50 });
    const [font, setFont] = useState('Arial');
    const [fontSize, setFontSize] = useState(48);
    const [color, setColor] = useState('#FFFFFF');
    const [isDragging, setIsDragging] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    const drawCanvas = useCallback(() => {
        if (!image || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = image.width;
        canvas.height = image.height;

        ctx.drawImage(image, 0, 0);

        ctx.font = `${fontSize}px ${font}`;
        ctx.fillStyle = color;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(text, textPos.x, textPos.y);
    }, [image, text, textPos, font, fontSize, color]);

    useEffect(() => {
        drawCanvas();
    }, [drawCanvas]);

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => setImage(img);
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDragging(true);
    };
    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDragging || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        setTextPos({
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY,
        });
    };

    const handleDownload = () => {
        if (!canvasRef.current) return;
        trackEvent('image_text_overlay_added');
        const link = document.createElement('a');
        link.href = canvasRef.current.toDataURL('image/png');
        link.download = 'text-overlay-image.png';
        link.click();
    };

    if (!image) {
        return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/jpeg', 'image/png', 'image/webp']} />;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 flex justify-center items-start bg-gray-100 p-2 rounded-lg border">
                <canvas ref={canvasRef} className="max-w-full h-auto cursor-move" 
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={() => setIsDragging(false)}
                    onMouseLeave={() => setIsDragging(false)}
                />
            </div>
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div>
                    <label className="block text-sm font-medium">Text</label>
                    <textarea value={text} onChange={e => setText(e.target.value)} rows={3} className="w-full p-2 border rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Font</label>
                    <select value={font} onChange={e => setFont(e.target.value)} className="w-full p-2 border rounded-md">
                        {WEBSAFE_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium">Font Size: {fontSize}px</label>
                    <input type="range" min="12" max="128" value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="w-full" />
                </div>
                 <div>
                    <label className="block text-sm font-medium">Color</label>
                    <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full h-10 p-1 border rounded-md" />
                </div>
                <div className="pt-4 space-y-3">
                    <button onClick={handleDownload} className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Download Image</button>
                    <button onClick={() => setImage(null)} className="w-full text-sm text-blue-600 hover:underline">Use another image</button>
                </div>
            </div>
        </div>
    );
};

export default ImageTextOverlay;