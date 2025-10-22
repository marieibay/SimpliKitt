import React, { useState, useRef, useEffect, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

const ASPECT_RATIOS = [
  { name: 'Free', value: undefined },
  { name: '1:1', value: 1 / 1 },
  { name: '16:9', value: 16 / 9 },
  { name: '4:3', value: 4 / 3 },
  { name: '3:2', value: 3 / 2 },
  { name: '9:16', value: 9 / 16 },
];

const MIN_CROP_SIZE = 20;

const ImageCropper: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [isCropped, setIsCropped] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const interactionRef = useRef<{
    type: string | null,
    startX: number,
    startY: number,
    startCrop: typeof crop
  }>({ type: null, startX: 0, startY: 0, startCrop: crop });


  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target?.result as string);
      setCroppedImageUrl(null);
      setIsCropped(false);
    };
    reader.readAsDataURL(file);
  };
  
  const initCrop = useCallback(() => {
    if (imageRef.current) {
      const { width: imgWidth, height: imgHeight } = imageRef.current.getBoundingClientRect();
      let newWidth = imgWidth * 0.8;
      let newHeight = imgHeight * 0.8;

      if(aspect) {
        if(imgWidth / aspect > imgHeight) { // constrained by height
            newHeight = imgHeight * 0.8;
            newWidth = newHeight * aspect;
        } else { // constrained by width
            newWidth = imgWidth * 0.8;
            newHeight = newWidth / aspect;
        }
      }

      setCrop({
        x: (imgWidth - newWidth) / 2,
        y: (imgHeight - newHeight) / 2,
        width: newWidth,
        height: newHeight,
      });
    }
  }, [aspect]);

  useEffect(() => {
    if(imageSrc) {
        initCrop();
    }
  }, [aspect, imageSrc, initCrop]);
  
  const updateCropPosition = (clientX: number, clientY: number) => {
    if (!interactionRef.current.type || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = clientX - rect.left;
    const currentY = clientY - rect.top;
    
    const dx = currentX - interactionRef.current.startX;
    const dy = currentY - interactionRef.current.startY;
    
    // FIX: The original destructuring with a spread operator `{ ...interactionRef.current.startCrop }`
    // was confusing the linter/compiler, causing the "Initializer provides no value" error. 
    // Simplified to direct destructuring which is functionally equivalent here since the 
    // properties are primitive types (numbers) and are copied by value.
    let { x, y, width, height } = interactionRef.current.startCrop;

    switch (interactionRef.current.type) {
      case 'move':
        x += dx;
        y += dy;
        break;
      case 'se':
        width += dx;
        height += dy;
        break;
      case 'sw':
        width -= dx;
        height += dy;
        x += dx;
        break;
      case 'ne':
        width += dx;
        height -= dy;
        y += dy;
        break;
      case 'nw':
        width -= dx;
        height -= dy;
        x += dx;
        y += dy;
        break;
      case 'n':
        height -= dy;
        y += dy;
        break;
      case 's':
        height += dy;
        break;
      case 'w':
        width -= dx;
        x += dx;
        break;
      case 'e':
        width += dx;
        break;
    }

    if (aspect) {
        if (['e', 'w', 'ne', 'nw', 'se', 'sw'].includes(interactionRef.current.type)) {
            const newHeight = width / aspect;
            if (interactionRef.current.type.includes('n')) {
                y += height - newHeight;
            }
            height = newHeight;
        } else {
            const newWidth = height * aspect;
            if (interactionRef.current.type.includes('w')) {
                x += width - newWidth;
            }
            width = newWidth;
        }
    }
    
    if (width < MIN_CROP_SIZE) width = MIN_CROP_SIZE;
    if (height < MIN_CROP_SIZE) height = MIN_CROP_SIZE;
    
    const { width: imgWidth, height: imgHeight } = rect;
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x + width > imgWidth) x = imgWidth - width;
    if (y + height > imgHeight) y = imgHeight - height;

    setCrop({ x, y, width, height });
  }

  const handleMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    updateCropPosition(e.clientX, e.clientY);
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    if (e.touches.length > 0) {
      updateCropPosition(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleMouseUp = () => {
    interactionRef.current.type = null;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };
  
  const handleTouchEnd = () => {
    interactionRef.current.type = null;
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleTouchEnd);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, type: string) => {
    e.preventDefault();
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    interactionRef.current = {
      type,
      startX: e.clientX - rect.left,
      startY: e.clientY - rect.top,
      startCrop: crop,
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>, type: string) => {
    e.preventDefault();
    if (!containerRef.current || e.touches.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    interactionRef.current = {
      type,
      startX: touch.clientX - rect.left,
      startY: touch.clientY - rect.top,
      startCrop: crop,
    };
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
  };

  const handleMouseDownOnHandle = (e: React.MouseEvent<HTMLDivElement>, type: string) => {
    e.stopPropagation();
    handleMouseDown(e, type);
  };

  const handleTouchStartOnHandle = (e: React.TouchEvent<HTMLDivElement>, type: string) => {
    e.stopPropagation();
    handleTouchStart(e, type);
  };

  const handleCrop = () => {
    if (!imageRef.current) return;
    const img = imageRef.current;
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;

    const canvas = document.createElement('canvas');
    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;
    
    ctx.drawImage(
      img,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );
    
    const url = canvas.toDataURL('image/png');
    setCroppedImageUrl(url);
    setIsCropped(true);
    trackEvent('image_cropped', { aspect: aspect || 'free' });
  };
  
  const handleReset = () => {
    setImageSrc(null);
    setCroppedImageUrl(null);
    setCrop({ x: 0, y: 0, width: 0, height: 0 });
    setIsCropped(false);
  };
  
  // View 1: No image uploaded yet
  if (!imageSrc) {
    return (
      <div className="space-y-6">
        <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/jpeg', 'image/png', 'image/webp']} />
      </div>
    );
  }

  // View 3: Cropped result is ready
  if (isCropped && croppedImageUrl) {
    return (
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold">Cropped Result</h3>
        <div className="flex justify-center p-2 bg-gray-100 rounded-lg">
            <img src={croppedImageUrl} alt="Cropped" className="max-w-full mx-auto border-2 rounded-lg shadow-lg" />
        </div>
        <div className="flex justify-center gap-4 pt-4">
          <a href={croppedImageUrl} download="cropped-image.png"
            className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
            Download Cropped Image
          </a>
           <button onClick={handleReset} className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition">
                Start Over
            </button>
        </div>
      </div>
    );
  }
  
  // View 2: Cropping interface
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-center gap-2 p-2 bg-gray-100 rounded-md">
        {ASPECT_RATIOS.map(ar => (
          <button key={ar.name} onClick={() => setAspect(ar.value)}
            className={`px-3 py-1 text-sm font-medium rounded-md transition ${aspect === ar.value ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-200'}`}>
            {ar.name}
          </button>
        ))}
      </div>
      
      <div ref={containerRef} className="relative select-none w-full max-w-2xl mx-auto overflow-hidden rounded-lg" style={{ touchAction: 'none' }}>
        <img ref={imageRef} src={imageSrc} alt="Source" className="w-full h-auto block" onLoad={initCrop}/>
        <div
          className="absolute border-2 border-white/70 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] cursor-move"
          style={{
            top: `${crop.y}px`,
            left: `${crop.x}px`,
            width: `${crop.width}px`,
            height: `${crop.height}px`,
          }}
          onMouseDown={(e) => handleMouseDown(e, 'move')}
          onTouchStart={(e) => handleTouchStart(e, 'move')}
          >
            {/* Corner Handles */}
            <div onMouseDown={(e) => handleMouseDownOnHandle(e, 'nw')} onTouchStart={(e) => handleTouchStartOnHandle(e, 'nw')} className="absolute -top-3 -left-3 w-6 h-6 bg-blue-500 rounded-full cursor-nwse-resize border-2 border-white"></div>
            <div onMouseDown={(e) => handleMouseDownOnHandle(e, 'ne')} onTouchStart={(e) => handleTouchStartOnHandle(e, 'ne')} className="absolute -top-3 -right-3 w-6 h-6 bg-blue-500 rounded-full cursor-nesw-resize border-2 border-white"></div>
            <div onMouseDown={(e) => handleMouseDownOnHandle(e, 'sw')} onTouchStart={(e) => handleTouchStartOnHandle(e, 'sw')} className="absolute -bottom-3 -left-3 w-6 h-6 bg-blue-500 rounded-full cursor-nesw-resize border-2 border-white"></div>
            <div onMouseDown={(e) => handleMouseDownOnHandle(e, 'se')} onTouchStart={(e) => handleTouchStartOnHandle(e, 'se')} className="absolute -bottom-3 -right-3 w-6 h-6 bg-blue-500 rounded-full cursor-nwse-resize border-2 border-white"></div>
            {/* Side Handles for Free mode */}
            {aspect === undefined && (
              <>
                <div onMouseDown={(e) => handleMouseDownOnHandle(e, 'n')} onTouchStart={(e) => handleTouchStartOnHandle(e, 'n')} className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-3 bg-blue-500 rounded-sm cursor-ns-resize"></div>
                <div onMouseDown={(e) => handleMouseDownOnHandle(e, 's')} onTouchStart={(e) => handleTouchStartOnHandle(e, 's')} className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-3 bg-blue-500 rounded-sm cursor-ns-resize"></div>
                <div onMouseDown={(e) => handleMouseDownOnHandle(e, 'w')} onTouchStart={(e) => handleTouchStartOnHandle(e, 'w')} className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-8 bg-blue-500 rounded-sm cursor-ew-resize"></div>
                <div onMouseDown={(e) => handleMouseDownOnHandle(e, 'e')} onTouchStart={(e) => handleTouchStartOnHandle(e, 'e')} className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-8 bg-blue-500 rounded-sm cursor-ew-resize"></div>
              </>
            )}
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button onClick={handleCrop} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
          Crop Image
        </button>
        <button onClick={handleReset} className="px-4 py-2 text-sm text-gray-600 hover:underline">
          Start Over
        </button>
      </div>
    </div>
  );
};

export default ImageCropper;
