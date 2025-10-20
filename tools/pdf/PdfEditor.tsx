import React, { useState, useRef, useEffect, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';

// Type definitions for PDF.js library loaded from CDN
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

// Type definitions for component state
interface PdfPage {
  canvas: HTMLCanvasElement;
  dataUrl: string;
  width: number;
  height: number;
}

interface Annotation {
  type: 'text' | 'highlight' | 'signature' | 'draw';
  page: number;
  x: number;
  y: number;
  text?: string;
  fontSize?: number;
  color?: string;
  width?: number;
  height?: number;
  points?: { x: number; y: number }[];
}

interface TextInputState {
  show: boolean;
  x: number;
  y: number;
  value: string;
}

const PdfEditor: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfPages, setPdfPages] = useState<PdfPage[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeTool, setActiveTool] = useState('select');
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [textInput, setTextInput] = useState<TextInputState>({ show: false, x: 0, y: 0, value: '' });
  const [isLibraryReady, setIsLibraryReady] = useState(!!window.pdfjsLib);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isLibraryReady) {
      if (window.pdfjsLib) {
         window.pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.3.136/pdf.worker.min.js`;
      }
      return;
    }

    const timeoutId = setTimeout(() => {
      if (!window.pdfjsLib) {
        setError("Editor failed to load. Please check your network connection, disable any ad-blockers, and refresh the page.");
      }
      clearInterval(checkIntervalId);
    }, 5000); // 5-second timeout

    const checkIntervalId = setInterval(() => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.3.136/pdf.worker.min.js`;
        setIsLibraryReady(true);
        clearInterval(checkIntervalId);
        clearTimeout(timeoutId);
      }
    }, 100);

    return () => {
      clearInterval(checkIntervalId);
      clearTimeout(timeoutId);
    };
  }, [isLibraryReady]);

  const handleFile = async (file: File) => {
    if (!isLibraryReady) {
      setError("PDF library is not available. Please try again later.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setPdfFile(file);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      const pages: PdfPage[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        if (context) {
          await page.render({ canvasContext: context, viewport }).promise;
        }
        pages.push({
          canvas: canvas,
          dataUrl: canvas.toDataURL(),
          width: viewport.width,
          height: viewport.height
        });
      }
      
      setPdfPages(pages);
      setCurrentPage(0);
      setAnnotations([]);
    } catch (err) {
      console.error("Failed to process PDF:", err);
      setError("Could not load the PDF. It may be corrupt, encrypted, or an unsupported format.");
      setPdfFile(null);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const renderCanvas = useCallback(() => {
    if (!canvasRef.current || pdfPages.length === 0 || !pdfPages[currentPage]) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const page = pdfPages[currentPage];
    
    canvas.width = page.width;
    canvas.height = page.height;
    
    const img = new Image();
    img.onload = () => {
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      
      annotations
        .filter(a => a.page === currentPage)
        .forEach(annotation => {
          if (annotation.type === 'text' && annotation.text) {
            ctx.font = `${annotation.fontSize || 16}px Arial`;
            ctx.fillStyle = annotation.color || '#000000';
            ctx.fillText(annotation.text, annotation.x, annotation.y);
          } else if (annotation.type === 'highlight') {
            ctx.fillStyle = 'rgba(255, 255, 0, 0.4)';
            ctx.fillRect(annotation.x, annotation.y, annotation.width || 100, annotation.height || 20);
          } else if (annotation.type === 'signature' && annotation.text) {
            ctx.font = '24px "Brush Script MT", cursive';
            ctx.fillStyle = '#0000FF';
            ctx.fillText(annotation.text, annotation.x, annotation.y);
          } else if (annotation.type === 'draw' && annotation.points) {
            ctx.strokeStyle = annotation.color || '#FF0000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            annotation.points.forEach((point, idx) => {
              if (idx === 0) ctx.moveTo(point.x, point.y);
              else ctx.lineTo(point.x, point.y);
            });
            ctx.stroke();
          }
        });
    };
    img.src = page.dataUrl;
  }, [currentPage, annotations, pdfPages]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === 'text') {
      setTextInput({ show: true, x, y, value: '' });
    } else if (activeTool === 'signature') {
      const signature = prompt('Enter your name to sign:');
      if (signature) {
        setAnnotations([...annotations, { type: 'signature', page: currentPage, x, y, text: signature }]);
      }
    } else if (activeTool === 'highlight') {
      setAnnotations([...annotations, { type: 'highlight', page: currentPage, x: x - 50, y: y - 10, width: 100, height: 20 }]);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === 'draw' && canvasRef.current) {
      setIsDrawing(true);
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setAnnotations([...annotations, { type: 'draw', page: currentPage, x, y, points: [{ x, y }], color: '#FF0000' }]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawing && activeTool === 'draw' && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setAnnotations(prev => {
        const newAnnotations = [...prev];
        const lastAnnotation = newAnnotations[newAnnotations.length - 1];
        if (lastAnnotation && lastAnnotation.type === 'draw' && lastAnnotation.points) {
          lastAnnotation.points.push({ x, y });
        }
        return newAnnotations;
      });
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const addTextAnnotation = () => {
    if (textInput.value.trim()) {
      setAnnotations([...annotations, {
        type: 'text',
        page: currentPage,
        x: textInput.x,
        y: textInput.y,
        text: textInput.value,
        fontSize: 16,
        color: '#000000'
      }]);
    }
    setTextInput({ show: false, x: 0, y: 0, value: '' });
  };

  const downloadEditedPage = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `edited-${pdfFile?.name.replace('.pdf', '') || 'document'}-page-${currentPage + 1}.png`;
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    }
  };

  const ToolButton: React.FC<{ tool: string, icon: React.ReactNode, label: string }> = ({ tool, icon, label }) => (
    <button
      onClick={() => setActiveTool(tool)}
      className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all ${
        activeTool === tool 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'bg-white text-gray-700 hover:bg-gray-100'
      }`}
      title={label}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  if (isProcessing) {
    return (
      <div className="text-center p-8 border-2 border-dashed rounded-lg bg-gray-50">
          <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <p className="text-lg font-semibold text-gray-700 mt-4">Processing PDF...</p>
          <p className="text-sm text-gray-500 mt-1">Please wait while we prepare the editor.</p>
      </div>
    );
  }
  
  if (!pdfFile) {
    return (
      <div className="space-y-4">
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
            <p className="font-semibold">Error Initializing Editor</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
        <FileUpload 
          onFileUpload={handleFile}
          acceptedMimeTypes={['application/pdf']}
          title="Upload PDF Document"
          description={isLibraryReady ? "Click to browse or drag and drop" : "Initializing PDF Editor..."}
          disabled={!isLibraryReady || !!error}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-4 h-[80vh]">
      {/* Toolbar */}
      <div className="col-span-12 lg:col-span-2 bg-white rounded-lg border p-4">
        <h3 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wider">Tools</h3>
        <div className="space-y-2">
          <ToolButton tool="select" label="Select" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>} />
          <ToolButton tool="text" label="Text" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7V6a2 2 0 012-2h4M4 7V5m0 2h2m-2 0h.01M4 7h.01M4 11h.01M4 15h.01M4 19h.01M8 21V5m0 16v.01M12 21v-4m4 4v-2m4-4V5m0 16v-2" /></svg>} />
          <ToolButton tool="highlight" label="Highlight" icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12h5M9 12H4M12 15V9M12 4L15 7M12 4L9 7M12 20l3-3M12 20l-3-3" /></svg>} />
          <ToolButton tool="draw" label="Draw" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>} />
          <ToolButton tool="signature" label="Sign" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>} />
          <div className="pt-4 mt-4 border-t">
            <button onClick={() => setAnnotations([])} className="w-full p-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition">Clear Annotations</button>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="col-span-12 lg:col-span-7 bg-gray-100 rounded-lg p-4 flex flex-col">
        <div className="mb-2 flex justify-between items-center bg-white p-2 rounded-md shadow-sm">
          <div className="flex items-center space-x-2">
            <button onClick={() => setCurrentPage(Math.max(0, currentPage - 1))} disabled={currentPage === 0} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">←</button>
            <span className="text-sm">Page {currentPage + 1} / {pdfPages.length}</span>
            <button onClick={() => setCurrentPage(Math.min(pdfPages.length - 1, currentPage + 1))} disabled={currentPage === pdfPages.length - 1} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">→</button>
          </div>
          <button onClick={downloadEditedPage} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold">Download Page</button>
        </div>
        <div className="flex-grow overflow-auto flex items-center justify-center rounded">
          <div className="relative shadow-lg">
            <canvas ref={canvasRef} onClick={handleCanvasClick} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} className={`bg-white ${activeTool === 'select' ? 'cursor-default' : 'cursor-crosshair'}`} />
            {textInput.show && (
              <div className="absolute bg-white border-2 border-blue-500 rounded p-1 shadow-lg" style={{ left: textInput.x, top: textInput.y }}>
                <input type="text" value={textInput.value} onChange={(e) => setTextInput({ ...textInput, value: e.target.value })} onKeyPress={(e) => e.key === 'Enter' && addTextAnnotation()} className="border-gray-300 rounded px-1 py-0.5 text-sm" placeholder="Type..." autoFocus />
                <button onClick={addTextAnnotation} className="px-1 py-0.5 bg-blue-600 text-white rounded text-xs ml-1">Add</button>
                <button onClick={() => setTextInput({ ...textInput, show: false })} className="px-1 py-0.5 bg-gray-200 rounded text-xs ml-1">X</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Page Thumbnails */}
      <div className="col-span-12 lg:col-span-3 bg-white rounded-lg border p-4">
        <h3 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wider">Pages</h3>
        <div className="space-y-2 h-[calc(80vh-50px)] overflow-y-auto">
          {pdfPages.map((page, idx) => (
            <div key={idx} onClick={() => setCurrentPage(idx)} className={`cursor-pointer border-2 rounded-md overflow-hidden ${currentPage === idx ? 'border-blue-500' : 'border-transparent hover:border-blue-300'}`}>
              <img src={page.dataUrl} alt={`Page ${idx + 1}`} className="w-full" />
              <div className="text-xs text-center py-1 bg-gray-100">Page {idx + 1}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PdfEditor;