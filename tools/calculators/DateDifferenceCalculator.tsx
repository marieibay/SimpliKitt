import React, { useState, useMemo } from 'react';

const DateDifferenceCalculator: React.FC = () => {
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const difference = useMemo(() => {
    if (!startDate || !endDate) return null;
    
    let d1 = new Date(startDate);
    let d2 = new Date(endDate);

    if (d1 > d2) {
      [d1, d2] = [d2, d1]; // Swap dates if start is after end
    }

    let years = d2.getFullYear() - d1.getFullYear();
    let months = d2.getMonth() - d1.getMonth();
    let days = d2.getDate() - d1.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(d2.getFullYear(), d2.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months, days };
  }, [startDate, endDate]);

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      
      {difference && (
        <div className="text-center p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Duration Between Dates</h3>
          <div className="flex justify-center items-baseline space-x-4">
            <div>
              <span className="text-4xl font-bold text-blue-600">{difference.years}</span>
              <span className="text-gray-600"> {difference.years === 1 ? 'Year' : 'Years'}</span>
            </div>
            <div>
              <span className="text-4xl font-bold text-blue-600">{difference.months}</span>
              <span className="text-gray-600"> {difference.months === 1 ? 'Month' : 'Months'}</span>
            </div>
            <div>
              <span className="text-4xl font-bold text-blue-600">{difference.days}</span>
              <span className="text-gray-600"> {difference.days === 1 ? 'Day' : 'Days'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateDifferenceCalculator;