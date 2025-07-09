import { Github, Linkedin, Instagram, Globe } from 'lucide-react';
import Link from 'next/link';

export default function InfoPage() {
    return (
        <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <header className="mb-12 text-center">
                <h1 className="font-headline text-4xl font-bold text-primary sm:text-5xl lg:text-6xl">
                    About the Traffic Calculator
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                    A tool for Traffic Volume Analysis and Road Improvement Strategies.
                </p>
            </header>
            <article className="prose prose-lg dark:prose-invert max-w-4xl mx-auto">
                <h2>Why I Built This</h2>
                <p>
                    This Traffic Calculator was born out of a passion for urban planning and a need for a practical tool for my college project on "Traffic Volume Analysis and Road Improvement Strategies." The goal was to create a simple yet powerful application that could help anyone, from students to city planners, to collect and analyze traffic data effectively. It bridges the gap between manual traffic counts and complex simulation software, offering an accessible entry point into data-driven traffic management.
                </p>

                <h2>The Purpose of This Tool</h2>
                <p>
                    The core purpose of this tool is to democratize traffic analysis. By inputting vehicle counts and observational data, users can:
                </p>
                <ul>
                    <li><strong>Quantify Traffic Volume:</strong> Get clear numbers on the types of vehicles using a particular road.</li>
                    <li><strong>Identify Patterns:</strong> Understand how traffic flow changes during different times of the day.</li>
                    <li><strong>Gain AI-Powered Insights:</strong> Receive automated analysis and concrete suggestions for improving traffic flow and safety, powered by generative AI.</li>
                    <li><strong>Generate Reports:</strong> Export the findings into a professional PDF report, perfect for presentations and project submissions.</li>
                </ul>
                <p>
                    Ultimately, it's about making our roads safer and more efficient, one data point at a time.
                </p>

                <h2>How It Can Be Used</h2>
                <p>
                    Using the calculator is straightforward:
                </p>
                <ol>
                    <li><strong>Set the Timer:</strong> Start by setting a duration for your observation period on the main page.</li>
                    <li><strong>Count Vehicles:</strong> As vehicles pass, use the intuitive counters for different vehicle types (2-wheelers, 4-wheelers, etc.).</li>
                    <li><strong>Add Observations:</strong> Once the timer finishes, you'll be prompted to provide qualitative data about traffic conditions like pedestrian flow, congestion levels, and potential causes.</li>
                    <li><strong>Analyze and Export:</strong> Submit your data to receive an instant AI-generated analysis and improvement suggestions. You can then view this data in a table and export the entire report as a PDF.</li>
                </ol>

                <h2>Connect With Me</h2>
                <p>
                    This project was a fantastic learning experience. I'm always open to feedback, collaboration, or just a friendly chat about technology and urbanism. You can find me here:
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
