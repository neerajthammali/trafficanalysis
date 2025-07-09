'use client';

import { type UseFormReturn } from 'react-hook-form';
import type { TrafficDetailsData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LoaderCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface TrafficDetailsFormProps {
  form: UseFormReturn<TrafficDetailsData>;
  onSubmit: (data: TrafficDetailsData) => void;
  isLoading: boolean;
}

const detailFields: {name: keyof Omit<TrafficDetailsData, 'remarks'>, label: string, options: readonly string[]}[] = [
    { name: 'humanFlow', label: 'Human Flow', options: ['Less', 'Moderate', 'Normal', 'High'] },
    { name: 'jams', label: 'Traffic Jams', options: ['Less', 'Moderate', 'Normal', 'High'] },
    { name: 'delays', label: 'Travel Delays', options: ['Less', 'Moderate', 'Normal', 'High'] },
    { name: 'signals', label: 'Signal Effectiveness', options: ['Less', 'Moderate', 'Normal', 'High'] },
    { name: 'wrongDirection', label: 'Wrong Direction Driving', options: ['Less', 'Moderate', 'Normal', 'High'] },
    { name: 'locality', label: 'Road Locality', options: ['Residential', 'Commercial', 'Industrial', 'Mixed-use'] },
    { name: 'congestionCause', label: 'Primary Cause of Congestion', options: ['Peak Hour Rush', 'Road Work', 'Accident', 'Special Event', 'None'] },
]

export function TrafficDetailsForm({ form, onSubmit, isLoading }: TrafficDetailsFormProps) {
  return (
    <Card className="shadow-lg sticky top-8">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Enter Observations</CardTitle>
        <CardDescription>Rate the following factors based on your observation to generate the analysis.</CardDescription>
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
                                {field.options.map(option => (
                                    <FormItem key={option} className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value={option} id={`${field.name}-${option}`} />
                                        </FormControl>
                                        <FormLabel htmlFor={`${field.name}-${option}`} className="font-normal cursor-pointer text-sm">{option}</FormLabel>
                                    </FormItem>
                                ))}
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            ))}

            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Additional Remarks</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Potholes on the road, poor visibility, etc."
                      className="resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optionally, add any other notes about road conditions.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />


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
