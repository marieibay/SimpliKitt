import React, { useState, useMemo, useEffect, useRef } from 'react';
import { trackEvent } from '../../analytics';

type CalcMode = 'percentOf' | 'isWhatPercent' | 'change';

const PercentageCalculator: React.FC = () => {
  const [mode, setMode] = useState<CalcMode>('percentOf');
  const [valA, setValA] = useState('');
  const [valB, setValB] = useState('');
  const resultRef = useRef<number | string | null>(null);


  const result = useMemo(() => {
    const a = parseFloat(valA);
    const b = parseFloat(valB);

    if (isNaN(a) || isNaN(b)) {
      return null;
    }

    try {
      if (mode === 'percentOf') {
        return (a / 100) * b;
      }
      if (mode === 'isWhatPercent') {
        if (b === 0) return 'Cannot divide by zero';
        return (a / b) * 100;
      }
      if (mode === 'change') {
        if (a === 0) return 'Cannot calculate change from zero';
        return ((b - a) / a) * 100;
      }
    } catch {
      return 'Calculation error';
    }
    return null;
  }, [mode, valA, valB]);

  useEffect(() => {
    // Track only when the result becomes a valid number from not being one
    if (typeof result === 'number' && typeof resultRef.current !== 'number') {
      trackEvent('percentage_calculated', { mode });
    }
    resultRef.current = result;
  }, [result, mode]);


  const renderInputs = () => {
    switch (mode) {
      case 'percentOf':
        return (
          <div className="flex items-center flex-wrap justify-center gap-x-4 gap-y-2">
            <span className="text-gray-700">What is</span>
            <input type="number" value={valA} onChange={(e) => setValA(e.target.value)} className="w-28 p-2 border rounded-md" placeholder="10" />
            <span className="text-gray-700">% of</span>
            <input type="number" value={valB} onChange={(e) => setValB(e.target.value)} className="w-28 p-2 border rounded-md" placeholder="50" />
            <span className="text-gray-700">?</span>
          </div>
        );
      case 'isWhatPercent':
        return (
          <div className="flex items-center flex-wrap justify-center gap-x-4 gap-y-2">
            <input type="number" value={valA} onChange={(e) => setValA(e.target.value)} className="w-28 p-2 border rounded-md" placeholder="5" />
            <span className="text-gray-700">is what percent of</span>
            <input type="number" value={valB} onChange={(e) => setValB(e.target.value)} className="w-28 p-2 border rounded-md" placeholder="50" />
            <span className="text-gray-700">?</span>
          </div>
        );
      case 'change':
        return (
          <div className="flex items-center flex-wrap justify-center gap-x-4 gap-y-2">
            <span className="text-gray-700">From</span>
            <input type="number" value={valA} onChange={(e) => setValA(e.target.value)} className="w-28 p-2 border rounded-md" placeholder="40" />
            <span className="text-gray-700">to</span>
            <input type="number" value={valB} onChange={(e) => setValB(e.target.value)} className="w-28 p-2 border rounded-md" placeholder="50" />
            <span className="text-gray-700">?</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center flex-wrap gap-2 p-1 bg-gray-100 rounded-lg">
        <button onClick={() => setMode('percentOf')} className={`px-4 py-2 text-sm font-medium rounded-md transition ${mode === 'percentOf' ? 'bg-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}>Percent Of</button>
        <button onClick={() => setMode('isWhatPercent')} className={`px-4 py-2 text-sm font-medium rounded-md transition ${mode === 'isWhatPercent' ? 'bg-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}>X is % of Y</button>
        <button onClick={() => setMode('change')} className={`px-4 py-2 text-sm font-medium rounded-md transition ${mode === 'change' ? 'bg-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}>Percentage Change</button>
      </div>
      
      <div className="p-6 bg-gray-50 rounded-lg flex justify-center">
          {renderInputs()}
      </div>

      {result !== null && (
        <div className="text-center">
            <p className="text-gray-600">Result:</p>
            <p className="text-4xl font-bold text-blue-600">
                {typeof result === 'number' ? result.toLocaleString(undefined, { maximumFractionDigits: 5 }) : result}
                {mode !== 'percentOf' && typeof result === 'number' && '%'}
            </p>
        </div>
      )}
    </div>
  );
};

export default PercentageCalculator;