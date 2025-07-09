import { TrafficInfo } from '@/components/traffic-info';

export default function InfoPage() {
    return (
        <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <header className="mb-12 text-center">
                <h1 className="font-headline text-4xl font-bold text-primary sm:text-5xl lg:text-6xl">
                    Traffic Engineering Basics
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    An overview of key principles and standards in traffic engineering.
                </p>
            </header>
            <div className="max-w-4xl mx-auto">
              <TrafficInfo />
            </div>
        </main>
    );
}
