import React, { useState, useMemo, useEffect, useRef } from 'react';
import { trackEvent } from '../../analytics';

const UNITS = {
  length: {
    name: 'Length',
    base: 'meters',
    units: {
      meters: 1,
      kilometers: 1000,
      centimeters: 0.01,
      millimeters: 0.001,
      miles: 1609.34,
      yards: 0.9144,
      feet: 0.3048,
      inches: 0.0254,
    },
  },
  mass: {
    name: 'Mass',
    base: 'grams',
    units: {
      grams: 1,
      kilograms: 1000,
      milligrams: 0.001,
      pounds: 453.592,
      ounces: 28.3495,
    },
  },
  volume: {
    name: 'Volume',
    base: 'liters',
    units: {
      liters: 1,
      milliliters: 0.001,
      'cubic-meters': 1000,
      gallons: 3.78541,
      quarts: 0.946353,
      pints: 0.473176,
      cups: 0.236588,
    },
  },
};

type UnitCategory = keyof typeof UNITS;

const UnitConverter: React.FC = () => {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = useState('meters');
  const [toUnit, setToUnit] = useState('feet');
  const [inputValue, setInputValue] = useState('1');
  // FIX: Initialize useRef with an explicit value to prevent "Expected 1 arguments, but got 0" error.
  const prevInputRef = useRef<string | undefined>(undefined);

  const availableUnits = UNITS[category].units;

  const result = useMemo(() => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return '';

    const fromFactor = availableUnits[fromUnit as keyof typeof availableUnits];
    const toFactor = availableUnits[toUnit as keyof typeof availableUnits];
    
    if (!fromFactor || !toFactor) return '';

    const valueInBase = value * fromFactor;
    const convertedValue = valueInBase / toFactor;

    return convertedValue.toLocaleString(undefined, { maximumFractionDigits: 6 });
  }, [inputValue, fromUnit, toUnit, category]);

  useEffect(() => {
    // Fire event only when a valid conversion occurs and the input value has changed
    if (result && inputValue !== prevInputRef.current) {
        trackEvent('unit_converted', { category, from: fromUnit, to: toUnit });
    }
    prevInputRef.current = inputValue;
  }, [result, inputValue, category, fromUnit, toUnit]);


  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value as UnitCategory;
    setCategory(newCategory);
    const newUnits = Object.keys(UNITS[newCategory].units);
    setFromUnit(newUnits[0]);
    setToUnit(newUnits[1] || newUnits[0]);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="p-4 bg-gray-50 rounded-lg">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Measurement Type
        </label>
        <select
          id="category"
          value={category}
          onChange={handleCategoryChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          {Object.entries(UNITS).map(([key, value]) => (
            <option key={key} value={key}>{value.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="md:col-span-1">
          <label htmlFor="fromValue" className="block text-sm font-medium text-gray-700 mb-1">From</label>
          <input
            id="fromValue"
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white"
          >
            {Object.keys(availableUnits).map(unit => (
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
            onChange={(e) => setToUnit(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white"
          >
            {Object.keys(availableUnits).map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default UnitConverter;