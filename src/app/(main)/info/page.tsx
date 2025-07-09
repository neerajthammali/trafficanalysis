
import { Github, Linkedin, Instagram, Globe } from 'lucide-react';
import Link from 'next/link';

export default function InfoPage() {
    return (
        <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <header className="mb-12 text-center">
                <h1 className="font-headline text-4xl font-bold text-primary sm:text-5xl lg:text-6xl">
                    My Awesome Traffic Calculator Story!
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                   Hi, I'm Neeraj! Let me tell you how this cool tool came to be.
                </p>
            </header>
            <article className="prose prose-lg dark:prose-invert max-w-4xl mx-auto">
                <h2>Why I Built This</h2>
                <p>
                    For my college project, I had to learn all about "Traffic Volume Analysis and Road Improvement Strategies." Sounds super serious, right? Well, I wanted to make it fun! So, I decided to build this little app. My big idea was to create something that wasn't boring, but was super easy for anyone to use to count cars and see how traffic really works. It’s like a video game, but for real roads!
                </p>

                <h2>What's The Big Idea?</h2>
                <p>
                    So, what does this thing actually do? It's like a traffic detective kit! With it, you can:
                </p>
                <ul>
                    <li><strong>Count Things That Go Vroom:</strong> Keep a tally of all the bikes, cars, and big trucks passing by.</li>
                    <li><strong>Spot the Rush Hour:</strong> Figure out if it's a super busy time or a sleepy time on the road.</li>
                    <li><strong>Get Secret AI Tips:</strong> Ask the super-smart AI brain for cool ideas on how to fix traffic jams!</li>
                    <li><strong>Make Awesome Reports:</strong> Turn your findings into a cool PDF report to show your friends or your teacher.</li>
                </ul>
                <p>
                    My dream is to help make our streets a little bit better and safer for everyone, one count at a time!
                </p>

                <h2>How Do I Use It?</h2>
                <p>
                    Ready to play? It's easy-peasy!
                </p>
                <ol>
                    <li><strong>Start the Clock:</strong> First, tell the app how long you want to watch the road for.</li>
                    <li><strong>Tap, Tap, Tap:</strong> Every time a vehicle goes by, just tap the right counter button. Simple!</li>
                    <li><strong>Be a Detective:</strong> When time's up, the app will ask you some questions. Was it crowded? Were there jams? You're the expert!</li>
                    <li><strong>BAM! See the Magic:</strong> The AI will whip up a report with ideas to make the roads better. You can even save it as a PDF!</li>
                </ol>

                <h2>Let's Be Friends!</h2>
                <p>
                    Making this was SO much fun, and I learned a ton. If you have any cool ideas, find a bug, or just want to say hi, you can find me on the internet! I'd love to connect.
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
