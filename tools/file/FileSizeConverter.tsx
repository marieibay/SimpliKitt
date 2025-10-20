import React, { useState, useMemo } from 'react';
import { trackEvent } from '../../analytics';

const UNITS = {
  'Bytes': 1,
  'Kilobytes (KB)': 1024,
  'Megabytes (MB)': 1024 ** 2,
  'Gigabytes (GB)': 1024 ** 3,
  'Terabytes (TB)': 1024 ** 4,
};

type Unit = keyof typeof UNITS;

const FileSizeConverter: React.FC = () => {
  const [inputValue, setInputValue] = useState('1024');
  const [fromUnit, setFromUnit] = useState<Unit>('Kilobytes (KB)');
  const [toUnit, setToUnit] = useState<Unit>('Megabytes (MB)');

  const result = useMemo(() => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return '';

    const fromFactor = UNITS[fromUnit];
    const toFactor = UNITS[toUnit];
    
    const valueInBytes = value * fromFactor;
    const convertedValue = valueInBytes / toFactor;

    return convertedValue.toLocaleString(undefined, { maximumFractionDigits: 6 });
  }, [inputValue, fromUnit, toUnit]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    trackEvent('file_size_converted', { from: fromUnit, to: toUnit });
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end p-4 bg-gray-50 rounded-lg">
        <div className="md:col-span-1">
          <label htmlFor="fromValue" className="block text-sm font-medium text-gray-700 mb-1">From</label>
          <input
            id="fromValue"
            type="number"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value as Unit)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white"
          >
            {Object.keys(UNITS).map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>
        
        <div className="text-center text-2xl font-semibold text-gray-500">=</div>

        <div className="md:col-span-1">
          <label htmlFor="toValue" className="block text-sm font-medium text-gray-700 mb-1">To</label>
          <input
            id="toValue"
            type="text"
            readOnly
            value={result}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
          />
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value as Unit)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white"
          >
            {Object.keys(UNITS).map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FileSizeConverter;