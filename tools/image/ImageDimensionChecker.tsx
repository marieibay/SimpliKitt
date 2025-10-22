import React, { useState } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

const ImageDimensionChecker: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => {
                setImage(img);
                setDimensions({ width: img.width, height: img.height });
                trackEvent('image_dimensions_checked');
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const handleReset = () => {
        setImage(null);
        setDimensions(null);
    };

    if (!image) {
        return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/*']} title="Upload an Image to Check Dimensions" />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-center p-4 bg-gray-100 border rounded-lg">
                <img src={image.src} alt="Preview" className="max-h-80 object-contain rounded" />
            </div>
            {dimensions && (
                 <div className="text-center p-6 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Image Dimensions</h3>
                    <p className="text-3xl font-bold text-blue-600">{dimensions.width}px &times; {dimensions.height}px</p>
                </div>
            )}
            <div className="text-center">
                <button onClick={handleReset} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Check Another Image</button>
            </div>
        </div>
    );
};

export default ImageDimensionChecker;
