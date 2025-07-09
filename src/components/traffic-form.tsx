'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { TrafficData } from '@/lib/types';
import { TrafficDataSchema } from '@/lib/types';
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
import { Textarea } from '@/components/ui/textarea';
import { Bike, CarFront, Car, Truck, LoaderCircle } from 'lucide-react';
import { CounterInput } from './counter-input';

interface TrafficFormProps {
  onSubmit: (data: TrafficData) => void;
  isLoading: boolean;
}

const vehicleTypes = [
  { name: 'twoWheelers', label: '2-Wheelers', icon: Bike },
  { name: 'threeWheelers', label: '3-Wheelers', icon: CarFront },
  { name: 'fourWheelers', label: '4-Wheelers', icon: Car },
  { name: 'heavyVehicles', label: 'Heavy Vehicles', icon: Truck },
] as const;


export function TrafficForm({ onSubmit, isLoading }: TrafficFormProps) {
  const form = useForm<TrafficData>({
    resolver: zodResolver(TrafficDataSchema),
    defaultValues: {
      twoWheelers: 0,
      threeWheelers: 0,
      fourWheelers: 0,
      heavyVehicles: 0,
      humanFlow: '',
      jams: '',
      delays: '',
      signals: '',
    },
  });

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Record Traffic Data</CardTitle>
        <CardDescription>Enter the counts and observations for the current interval.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4 rounded-lg border p-4">
              <h3 className="text-lg font-medium">Vehicle Counts</h3>
              {vehicleTypes.map((vehicle) => (
                <FormField
                  key={vehicle.name}
                  control={form.control}
                  name={vehicle.name}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="flex items-center gap-2 font-medium">
                          <vehicle.icon className="h-5 w-5 text-primary" />
                          {vehicle.label}
                        </FormLabel>
                        <FormControl>
                          <CounterInput value={field.value} onChange={field.onChange} />
                        </FormControl>
                      </div>
                      <FormMessage className="text-right" />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="timeInterval"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Interval</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select interval" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="30 mins">30 mins</SelectItem>
                        <SelectItem value="1 hour">1 hour</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="trafficTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Traffic Time</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Normal Time">Normal Time</SelectItem>
                        <SelectItem value="Peak Time">Peak Time</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
                <FormField control={form.control} name="humanFlow" render={({ field }) => (
                    <FormItem><FormLabel>Human Flow</FormLabel><FormControl><Textarea placeholder="e.g., High pedestrian traffic on sidewalks..." {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="jams" render={({ field }) => (
                    <FormItem><FormLabel>Jams</FormLabel><FormControl><Textarea placeholder="e.g., Frequent bottleneck near the intersection..." {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="delays" render={({ field }) => (
                    <FormItem><FormLabel>Delays</FormLabel><FormControl><Textarea placeholder="e.g., Average delay of 5 minutes..." {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="signals" render={({ field }) => (
                    <FormItem><FormLabel>Signals</FormLabel><FormControl><Textarea placeholder="e.g., Signal timing seems short for peak hours..." {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              {isLoading ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Record & Analyze'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
