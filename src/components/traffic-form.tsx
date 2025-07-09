'use client';

import { useForm } from 'react-hook-form';
import type { TrafficDetailsData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LoaderCircle } from 'lucide-react';

interface TrafficDetailsFormProps {
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const detailFields: {name: keyof TrafficDetailsData, label: string}[] = [
    { name: 'humanFlow', label: 'Human Flow' },
    { name: 'jams', label: 'Traffic Jams' },
    { name: 'delays', label: 'Travel Delays' },
    { name: 'signals', label: 'Signal Effectiveness' },
    { name: 'wrongDirection', label: 'Wrong Direction Driving' },
]

const ratingOptions = ['Less', 'Moderate', 'Normal', 'High'];

export function TrafficDetailsForm({ onSubmit, isLoading }: TrafficDetailsFormProps) {
  const form = useForm<TrafficDetailsData>();

  return (
    <Card className="shadow-lg sticky top-8">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Enter Observations</CardTitle>
        <CardDescription>Rate the following factors based on your observation.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            
            {detailFields.map(field => (
                <FormField
                    key={field.name}
                    control={form.control}
                    name={field.name}
                    render={({ field: renderField }) => (
                    <FormItem>
                        <FormLabel>{field.label}</FormLabel>
                        <Select onValueChange={renderField.onChange} defaultValue={renderField.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select rating" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {ratingOptions.map(option => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            ))}

            <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              {isLoading ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Generate Analysis'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
