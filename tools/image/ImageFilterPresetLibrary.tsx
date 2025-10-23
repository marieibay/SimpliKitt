import React, { useState, useRef, useEffect, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent, trackGtagEvent } from '../../analytics';

const filters = {
    'None': 'none',
    'Grayscale': 'grayscale(100%)',
    'Sepia': 'sepia(100%)',
    'Invert': 'invert(100%)',
    'Contrast': 'contrast(150%)',
    'Saturate': 'saturate(200%)',
    'Vintage': 'sepia(60%) contrast(110%) brightness(90%)',
    'Cool': 'contrast(110%) saturate(150%) hue-rotate(-15deg)',
    'Warm': 'sepia(40%) contrast(110%) saturate(120%)'
};

const ImageFilterPresetLibrary: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [activeFilter, setActiveFilter] = useState('None');
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => setImage(img);
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const applyFilter = useCallback(() => {
        if (!image || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = image.width;
        canvas.height = image.height;
        ctx.filter = filters[activeFilter as keyof typeof filters];
        ctx.drawImage(image, 0, 0);

        setResultUrl(canvas.toDataURL());
    }, [image, activeFilter]);

    useEffect(() => {
        if (image) applyFilter();
    }, [image, activeFilter, applyFilter]);

    const handleDownload = () => {
        if (!resultUrl) return;
        trackEvent('image_preset_filter_applied', { filter: activeFilter });
        trackGtagEvent('tool_used', {
            event_category: 'Image Tools',
            event_label: 'Image Filter Preset Library',
            tool_name: 'image-filter-preset-library',
            is_download: true,
            filter_name: activeFilter,
        });
        const link = document.createElement('a');
        link.href = resultUrl;
        link.download = `filtered-${activeFilter.toLowerCase()}.png`;
        link.click();
    };

    if (!image) {
        return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/*']} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-center items-center bg-gray-100 p-4 rounded-lg border min-h-[300px]">
                {resultUrl ? <img src={resultUrl} alt="Preview" className="max-w-full max-h-[500px]" /> : <p>Loading...</p>}
                <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
                {Object.keys(filters).map(name => (
                    <button key={name} onClick={() => setActiveFilter(name)} className={`px-4 py-2 text-sm rounded-lg ${activeFilter === name ? 'bg-blue-600 text-white' : 'bg-white border hover:bg-gray-100'}`}>{name}</button>
                ))}
            </div>
            <div className="flex justify-center gap-4">
                <button onClick={handleDownload} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Download Image</button>
                <button onClick={() => setImage(null)} className="px-4 py-2 text-sm text-gray-600 hover:underline">Use another image</button>
            </div>
        </div>
    );
};

export default ImageFilterPresetLibrary;