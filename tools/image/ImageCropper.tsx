
import React, { useState, useRef, useCallback, useEffect } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackGtagEvent } from '../../analytics';

const aspectRatios: { [key: string]: number | null } = {
    'Free': null,
    '1:1': 1,
    '16:9': 16 / 9,
    '4:3': 4 / 3,
    '3:2': 3 / 2,
    '9:16': 9 / 16,
};

type Handle = 'tl' | 'tr' | 'bl' | 'br' | 't' | 'b' | 'l' | 'r' | 'move';

const ImageCropper: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const [aspect, setAspect] = useState<string>('Free');
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const interactionRef = useRef<{
        isDragging: boolean;
        handle: Handle | null;
        startX: number;
        startY: number;
        startCrop: typeof crop;
    }>({ isDragging: false, handle: null, startX: 0, startY: 0, startCrop: { x: 0, y: 0, width: 0, height: 0 } });
    const scaleRef = useRef(1);

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => {
                setImage(img);
                const initialWidth = img.width / 2;
                const initialHeight = img.height / 2;
                setCrop({ x: (img.width - initialWidth) / 2, y: (img.height - initialHeight) / 2, width: initialWidth, height: initialHeight });
                setResultUrl(null);
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
        
        const displayWidth = Math.min(canvas.parentElement!.clientWidth, image.width);
        scaleRef.current = displayWidth / image.width;
        canvas.width = displayWidth;
        canvas.height = image.height * scaleRef.current;
        
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        const sCrop = {
            x: crop.x * scaleRef.current,
            y: crop.y * scaleRef.current,
            width: crop.width * scaleRef.current,
            height: crop.height * scaleRef.current
        };

        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.clearRect(sCrop.x, sCrop.y, sCrop.width, sCrop.height);

        ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, sCrop.x, sCrop.y, sCrop.width, sCrop.height);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.strokeRect(sCrop.x, sCrop.y, sCrop.width, sCrop.height);

        // Draw handles
        ctx.fillStyle = '#007bff';
        const handleSize = 12;
        const h = handleSize / 2;
        const handles = {
            tl: [sCrop.x - h, sCrop.y - h], tr: [sCrop.x + sCrop.width - h, sCrop.y - h],
            bl: [sCrop.x - h, sCrop.y + sCrop.height - h], br: [sCrop.x + sCrop.width - h, sCrop.y + sCrop.height - h],
            t: [sCrop.x + sCrop.width / 2 - h, sCrop.y - h], b: [sCrop.x + sCrop.width / 2 - h, sCrop.y + sCrop.height - h],
            l: [sCrop.x - h, sCrop.y + sCrop.height / 2 - h], r: [sCrop.x + sCrop.width - h, sCrop.y + sCrop.height / 2 - h],
        };
        Object.values(handles).forEach(([x, y]) => ctx.fillRect(x, y, handleSize, handleSize));

    }, [image, crop]);

    useEffect(() => {
        draw();
        window.addEventListener('resize', draw);
        return () => window.removeEventListener('resize', draw);
    }, [draw]);

    const getHandleAt = (x: number, y: number): Handle | null => {
        const sCrop = { x: crop.x * scaleRef.current, y: crop.y * scaleRef.current, width: crop.width * scaleRef.current, height: crop.height * scaleRef.current };
        const handleSize = 20; // larger for touch
        const h = handleSize / 2;
        
        const check = (hx: number, hy: number) => x > hx - h && x < hx + h && y > hy - h && y < hy + h;

        if (check(sCrop.x, sCrop.y)) return 'tl';
        if (check(sCrop.x + sCrop.width, sCrop.y)) return 'tr';
        if (check(sCrop.x, sCrop.y + sCrop.height)) return 'bl';
        if (check(sCrop.x + sCrop.width, sCrop.y + sCrop.height)) return 'br';
        if (aspectRatios[aspect] === null) {
            if (check(sCrop.x + sCrop.width / 2, sCrop.y)) return 't';
            if (check(sCrop.x + sCrop.width / 2, sCrop.y + sCrop.height)) return 'b';
            if (check(sCrop.x, sCrop.y + sCrop.height / 2)) return 'l';
            if (check(sCrop.x + sCrop.width, sCrop.y + sCrop.height / 2)) return 'r';
        }
        if (x > sCrop.x && x < sCrop.x + sCrop.width && y > sCrop.y && y < sCrop.y + sCrop.height) return 'move';
        return null;
    };
    
    const handleInteractionStart = (e: React.MouseEvent | React.TouchEvent) => {
        if (!canvasRef.current) return;
        e.preventDefault();
        const rect = canvasRef.current.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const handle = getHandleAt(x, y);
        if (handle) {
            interactionRef.current = { isDragging: true, handle, startX: clientX, startY: clientY, startCrop: { ...crop } };
        }
    };
    
    const handleInteractionMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!interactionRef.current.isDragging || !image) return;
        e.preventDefault();
        
        const { handle, startX, startY, startCrop: s } = interactionRef.current;
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        let dx = (clientX - startX) / scaleRef.current;
        let dy = (clientY - startY) / scaleRef.current;
        let newCrop = { ...s };

        const ar = aspectRatios[aspect];

        switch(handle) {
            case 'tl': dx = Math.min(dx, s.width - 20); dy = Math.min(dy, s.height - 20); if(ar) { dx = dy * ar; } newCrop = { x: s.x + dx, y: s.y + dy, width: s.width - dx, height: s.height - dy }; break;
            case 'tr': dx = Math.max(dx, -(s.width - 20)); dy = Math.min(dy, s.height - 20); if(ar) { dx = -dy * ar; } newCrop = { x: s.x, y: s.y + dy, width: s.width + dx, height: s.height - dy }; break;
            case 'bl': dx = Math.min(dx, s.width - 20); dy = Math.max(dy, -(s.height - 20)); if(ar) { dx = -dy * ar; } newCrop = { x: s.x + dx, y: s.y, width: s.width - dx, height: s.height + dy }; break;
            case 'br': dx = Math.max(dx, -(s.width - 20)); dy = Math.max(dy, -(s.height - 20)); if(ar) { dx = dy * ar; } newCrop = { x: s.x, y: s.y, width: s.width + dx, height: s.height + dy }; break;
            case 't': newCrop = { ...s, y: s.y + dy, height: s.height - dy }; break;
            case 'b': newCrop = { ...s, height: s.height + dy }; break;
            case 'l': newCrop = { ...s, x: s.x + dx, width: s.width - dx }; break;
            case 'r': newCrop = { ...s, width: s.width + dx }; break;
            case 'move': newCrop = { ...s, x: s.x + dx, y: s.y + dy }; break;
        }

        // Enforce aspect ratio
        if (ar) {
            if (handle === 'tl' || handle === 'bl') { newCrop.x += newCrop.width - newCrop.height * ar; }
            newCrop.width = newCrop.height * ar;
        }

        // Clamp to image bounds
        newCrop.x = Math.max(0, newCrop.x);
        newCrop.y = Math.max(0, newCrop.y);
        newCrop.width = Math.min(newCrop.width, image.width - newCrop.x);
        newCrop.height = Math.min(newCrop.height, image.height - newCrop.y);

        setCrop(newCrop);
    };

    const handleInteractionEnd = () => {
        interactionRef.current.isDragging = false;
    };
    
    const handleCrop = () => {
        if(!image) return;
        const canvas = document.createElement('canvas');
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
        setResultUrl(canvas.toDataURL());
        trackGtagEvent('tool_used', {
            event_category: 'Image Tools',
            event_label: 'Image Cropper',
            tool_name: 'image-cropper',
            is_download: true,
            aspect_ratio: aspect
        });
    };

    if (!image) {
        return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/jpeg', 'image/png']} />;
    }

    return (
        <div className="space-y-6">
             <div className="flex flex-wrap justify-center gap-2">
                {Object.keys(aspectRatios).map(r => (
                    <button key={r} onClick={() => setAspect(r)} className={`px-4 py-2 text-sm rounded-lg ${aspect === r ? 'bg-blue-600 text-white' : 'bg-white border hover:bg-gray-100'}`}>
                        {r}
                    </button>
                ))}
            </div>
            <div className="flex justify-center touch-none"
                 onMouseDown={handleInteractionStart} onMouseMove={handleInteractionMove} onMouseUp={handleInteractionEnd} onMouseLeave={handleInteractionEnd}
                 onTouchStart={handleInteractionStart} onTouchMove={handleInteractionMove} onTouchEnd={handleInteractionEnd}>
                <canvas ref={canvasRef} className="max-w-full h-auto cursor-move" />
            </div>
            <div className="text-center">
                 <button onClick={handleCrop} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Crop Image</button>
            </div>
            {resultUrl && (
                <div className="text-center space-y-4">
                    <h3 className="text-xl font-bold">Cropped Result</h3>
                    <img src={resultUrl} alt="Cropped" className="mx-auto max-w-full h-auto border" />
                    <a href={resultUrl} download="cropped-image.png" className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Download Cropped Image</a>
                </div>
            )}
        </div>
    );
};

export default ImageCropper;
