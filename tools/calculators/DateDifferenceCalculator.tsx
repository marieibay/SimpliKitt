
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { trackGtagEvent } from '../../analytics';

const DateDifferenceCalculator: React.FC = () => {
    const today = new Date().toISOString().split('T')[0];
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
    const hasTrackedRef = useRef(false);

    const difference = useMemo(() => {
        if (!startDate || !endDate) return null;

        let d1 = new Date(startDate);
        let d2 = new Date(endDate);

        if (d1 > d2) {
            [d1, d2] = [d2, d1];
        }

        let years = d2.getFullYear() - d1.getFullYear();
        let months = d2.getMonth() - d1.getMonth();
        let days = d2.getDate() - d1.getDate();
        
        if (days < 0) {
            months--;
            const lastMonth = new Date(d2.getFullYear(), d2.getMonth(), 0);
            days += lastMonth.getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        return { years, months, days };
    }, [startDate, endDate]);

    useEffect(() => {
        if (difference && !hasTrackedRef.current) {
            trackGtagEvent('tool_used', {
                event_category: 'Calculators & Time Tools',
                event_label: 'Date Difference Calculator',
                tool_name: 'date-difference-calculator',
                is_download: false,
            });
            hasTrackedRef.current = true;
        }
    }, [difference]);

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(e.target.value);
        hasTrackedRef.current = false;
    }
    
    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(e.target.value);
        hasTrackedRef.current = false;
    }

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium">Start Date</label>
                    <input type="date" value={startDate} onChange={handleStartDateChange} className="w-full p-2 mt-1 border-gray-300 rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium">End Date</label>
                    <input type="date" value={endDate} onChange={handleEndDateChange} className="w-full p-2 mt-1 border-gray-300 rounded-md" />
                </div>
            </div>
            {difference && (
                <div className="text-center p-6 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Duration</h3>
                    <div className="flex flex-wrap justify-center items-baseline gap-x-4 gap-y-2">
                        <div>
                            <span className="text-4xl font-bold text-blue-600">{difference.years}</span>
                            <span className="text-lg text-gray-600 ml-1">years</span>
                        </div>
                        <div>
                            <span className="text-4xl font-bold text-blue-600">{difference.months}</span>
                            <span className="text-lg text-gray-600 ml-1">months</span>
                        </div>
                        <div>
                            <span className="text-4xl font-bold text-blue-600">{difference.days}</span>
                            <span className="text-lg text-gray-600 ml-1">days</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateDifferenceCalculator;
