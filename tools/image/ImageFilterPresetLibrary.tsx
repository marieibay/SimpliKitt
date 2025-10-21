import React, { useState, useRef, useEffect, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

const FILTERS = {
  'Normal': 'none',
  '1977': 'sepia(.5) hue-rotate(-30deg) saturate(1.4) contrast(0.9)',
  'Clarendon': 'contrast(1.2) saturate(1.35)',
  'Gingham': 'contrast(0.9) brightness(1.1)',
  'Lark': 'contrast(.9) saturate(1.1) brightness(1.1)',
  'Moon': 'grayscale(1) contrast(1.1) brightness(1.1)',
  'Slumber': 'saturate(0.66) brightness(1.05) sepia(0.2)',
};
type FilterName = keyof typeof FILTERS;

const ImageFilterPresetLibrary: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [activeFilter, setActiveFilter] = useState<FilterName>('Normal');
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
        ctx.filter = FILTERS[activeFilter];
        ctx.drawImage(image, 0, 0);
    }, [image, activeFilter]);

    useEffect(() => {
        applyFilter();
    }, [image, activeFilter, applyFilter]);

    const handleFilterSelect = (filterName: FilterName) => {
        setActiveFilter(filterName);
        trackEvent('image_filter_preset_applied', { filter: filterName });
    }

    const handleDownload = () => {
        if (!canvasRef.current) return;
        const link = document.createElement('a');
        link.href = canvasRef.current.toDataURL('image/png');
        link.download = `filtered-${activeFilter.toLowerCase()}.png`;
        link.click();
    };
    
    if (!image) {
        return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/jpeg', 'image/png', 'image/webp']} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-center items-center bg-gray-100 p-4 rounded-lg border">
                <canvas ref={canvasRef} className="max-w-full max-h-[500px]" />
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-3">Filter Presets</h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {(Object.keys(FILTERS) as FilterName[]).map(name => (
                        <div key={name} onClick={() => handleFilterSelect(name)} className="text-center cursor-pointer">
                            <div className={`rounded-lg overflow-hidden border-2 ${activeFilter === name ? 'border-blue-600' : 'border-transparent'}`}>
                                <img src={image.src} style={{ filter: FILTERS[name] }} className="w-full h-24 object-cover" />
                            </div>
                            <p className={`text-sm mt-1 font-medium ${activeFilter === name ? 'text-blue-600' : 'text-gray-600'}`}>{name}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-center gap-4 pt-4 border-t">
                <button onClick={handleDownload} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Download Image</button>
                <button onClick={() => setImage(null)} className="px-4 py-2 text-sm text-gray-600 hover:underline">Use another image</button>
            </div>
        </div>
    );
};

export default ImageFilterPresetLibrary;