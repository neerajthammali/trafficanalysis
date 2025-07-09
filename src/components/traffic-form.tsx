'use client';

import { type UseFormReturn } from 'react-hook-form';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LoaderCircle } from 'lucide-react';

interface TrafficDetailsFormProps {
  form: UseFormReturn<TrafficDetailsData>;
  onSubmit: (data: TrafficDetailsData) => void;
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

export function TrafficDetailsForm({ form, onSubmit, isLoading }: TrafficDetailsFormProps) {
  return (
    <Card className="shadow-lg sticky top-8">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Enter Observations</CardTitle>
        <CardDescription>Rate the following factors based on your observation.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {detailFields.map(field => (
                <FormField
                    key={field.name}
                    control={form.control}
                    name={field.name}
                    render={({ field: renderField }) => (
                    <FormItem className="space-y-3">
                        <FormLabel className="font-semibold">{field.label}</FormLabel>
                        <FormControl>
                            <RadioGroup
                                onValueChange={renderField.onChange}
                                defaultValue={renderField.value}
                                className="grid grid-cols-2 gap-x-4 gap-y-2"
                            >
                                {ratingOptions.map(option => (
                                    <FormItem key={option} className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value={option} id={`${field.name}-${option}`} />
                                        </FormControl>
                                        <FormLabel htmlFor={`${field.name}-${option}`} className="font-normal cursor-pointer">{option}</FormLabel>
                                    </FormItem>
                                ))}
                            </RadioGroup>
                        </FormControl>
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
