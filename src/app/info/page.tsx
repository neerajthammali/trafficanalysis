import { Github, Linkedin, Instagram, Globe } from 'lucide-react';
import Link from 'next/link';

export default function InfoPage() {
    return (
        <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <header className="mb-12 text-center">
                <h1 className="font-headline text-4xl font-bold text-primary sm:text-5xl lg:text-6xl">
                    About Traffic Analyzer
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                   Hi, I'm Neeraj! Here's the story behind this tool.
                </p>
            </header>
            <article className="prose prose-lg dark:prose-invert max-w-4xl mx-auto">
                <h2>The "Why"</h2>
                <p>
                    For a college project on "Traffic Volume Analysis and Road Improvement Strategies," I needed to get hands-on with data. I wanted to build something more engaging than a simple spreadsheet.
                </p>
                <p>
                    My goal was to create a tool that was both easy to use and powerful, turning the tedious task of traffic counting into a more interactive experience.
                </p>

                <h2>Key Features</h2>
                <p>
                    This app is a complete toolkit for basic traffic analysis:
                </p>
                <ul>
                    <li><strong>Vehicle Counting:</strong> Tally various vehicle types in real-time.</li>
                    <li><strong>Contextual Data:</strong> Record observations on traffic flow, congestion, and other qualitative factors.</li>
                    <li><strong>AI-Powered Insights:</strong> Receive automated analysis and improvement suggestions based on your data.</li>
                    <li><strong>PDF Reporting:</strong> Export your findings into a clean, professional PDF document.</li>
                </ul>
                <p>
                    The ultimate vision is to provide a simple yet effective way to gather data that can contribute to safer and more efficient roads.
                </p>

                <h2>How to Use It</h2>
                <p>
                    Getting started is straightforward:
                </p>
                <ol>
                    <li><strong>Set Survey Duration:</strong> Define the time period for your observation.</li>
                    <li><strong>Count Vehicles:</strong> Use the dedicated counters to log passing vehicles.</li>
                    <li><strong>Add Observations:</strong> After the timer ends, provide details on traffic conditions.</li>
                    <li><strong>Generate Report:</strong> The AI will process your data and create a comprehensive report, ready for export.</li>
                </ol>

                <h2>Connect With Me</h2>
                <p>
                    This project was a fantastic learning experience. I'd love to connect with others who are passionate about technology and urban planning. Feel free to reach out!
                </p>
                <div className="not-prose mt-8 flex items-center justify-center gap-8">
                    <Link href="https://github.com/neerajthammali" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary">
                        <Github className="h-8 w-8" />
                        <span className="sr-only">GitHub</span>
                    </Link>
                    <Link href="https://linkedin.com/in/neerajthammali" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary">
                        <Linkedin className="h-8 w-8" />
                        <span className="sr-only">LinkedIn</span>
                    </Link>
                    <Link href="https://instagram.com/neerajthammali" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary">
                        <Instagram className="h-8 w-8" />
                        <span className="sr-only">Instagram</span>
                    </Link>
                    <Link href="https://neerajthammali.vercel.app" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary">
                        <Globe className="h-8 w-8" />
                        <span className="sr-only">Portfolio</span>
                    </Link>
                </div>
            </article>
        </main>
    );
}
