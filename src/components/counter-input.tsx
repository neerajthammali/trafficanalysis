'use client';

import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface CounterInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function CounterInput({ value, onChange }: CounterInputProps) {
    const safeValue = value || 0;

    const increment = () => onChange(safeValue + 1);
    const decrement = () => onChange(Math.max(0, safeValue - 1));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const num = parseInt(e.target.value, 10);
        if (!isNaN(num) && num >= 0) {
            onChange(num);
        } else if (e.target.value === '') {
            onChange(0);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 shrink-0 rounded-full"
                onClick={decrement}
                disabled={safeValue <= 0}
            >
                <Minus className="h-4 w-4" />
                <span className="sr-only">Decrease</span>
            </Button>
            <Input
                type="text"
                className="w-16 text-center font-bold text-lg"
                value={safeValue}
                onChange={handleChange}
                onBlur={(e) => {
                  if (e.target.value === '') {
                    onChange(0);
                  }
                }}
                inputMode="numeric"
                pattern="[0-9]*"
            />
            <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 shrink-0 rounded-full"
                onClick={increment}
            >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Increase</span>
            </Button>
        </div>
    );
}
