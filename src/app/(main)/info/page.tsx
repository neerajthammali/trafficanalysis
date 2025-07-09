export default function InfoPage() {
    return (
        <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <header className="mb-12 text-center">
                <h1 className="font-headline text-4xl font-bold text-primary sm:text-5xl lg:text-6xl">
                    The Evolution of Traffic Engineering
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                    A documentary-style journey through the past, present, and future of managing movement in our bustling world.
                </p>
            </header>
            <article className="prose prose-lg dark:prose-invert max-w-4xl mx-auto">
                <p>
                    From chaotic streets filled with horse-drawn carriages to the promise of autonomous superhighways, traffic engineering has been the silent force shaping our cities and daily commutes. It's a field born out of necessity, driven by innovation, and constantly adapting to the rhythm of human movement. This is its story.
                </p>

                <h2>Timeline: A Journey Through a Century of Change</h2>
                <ul>
                    <li><strong>Early 20th Century:</strong> The dawn of the automobile. Streets become a chaotic mix of pedestrians, horses, and new, noisy machines. The first traffic control officers appear, manually directing flow at busy intersections.</li>
                    <li><strong>1920s-1940s:</strong> The first electric traffic signals are installed. Engineers begin systematic studies of traffic patterns, leading to the development of fundamental concepts like traffic volume and speed studies.</li>
                    <li><strong>1950s-1970s:</strong> The golden age of highway construction, exemplified by the U.S. Interstate Highway System. Traffic engineering becomes a formal discipline with standardized manuals and practices, like the Highway Capacity Manual.</li>
                    <li><strong>1980s-1990s:</strong> Computers revolutionize the field. Simulation software allows engineers to model traffic and test solutions virtually. The first Intelligent Transportation Systems (ITS) emerge, using sensors and data to manage traffic dynamically.</li>
                    <li><strong>2000s-Present:</strong> The era of Big Data and AI. GPS, mobile phones, and advanced sensors provide unprecedented amounts of real-time data. The focus shifts towards efficiency, sustainability, and multimodal transport (integrating cars, public transit, cycling, and walking).</li>
                </ul>

                <h2>Technical Fundamentals: The Science of Flow</h2>
                <p>
                    At its core, traffic engineering is about understanding and predicting the interaction of vehicles, drivers, and infrastructure. Key principles include:
                </p>
                <ul>
                    <li><strong>Traffic Flow Theory:</strong> This describes the relationship between speed (how fast vehicles are moving), density (how many vehicles are in a given space), and flow (how many vehicles pass a point over time).</li>
                    <li><strong>Capacity Analysis:</strong> Determining the maximum number of vehicles a road or intersection can handle effectively. This is crucial for planning and design.</li>
                    <li><strong>Level of Service (LOS):</strong> A qualitative measure (from A to F) that describes the operational conditions of a road, based on factors like speed, travel time, and driver comfort. LOS 'A' is free-flowing, while LOS 'F' is a complete breakdown (gridlock).</li>
                    <li><strong>Intersection Design:</strong> The heart of urban traffic management. This involves designing intersections (signalized, unsignalized, roundabouts) to maximize safety and minimize delay.</li>
                </ul>

                <h2>Standards &amp; Formulas: The Language of the Road</h2>
                <p>
                    Standardization ensures that roads are safe and predictable. In India, the Indian Road Congress (IRC) sets the guidelines. Globally, manuals like the Highway Capacity Manual (HCM) are a benchmark. A fundamental formula every engineer knows is:
                </p>
                <blockquote>
                    <p><strong>Flow (q) = Density (k) × Speed (u)</strong></p>
                </blockquote>
                <p>
                    This simple equation governs the state of traffic. Another key concept is the Passenger Car Unit (PCU), which converts different vehicle types (like trucks and buses) into an equivalent number of standard passenger cars for easier analysis.
                </p>

                <h2>Modern Applications: The Smart City in Action</h2>
                <p>
                    Today's traffic engineering is a high-tech field:
                </p>
                <ul>
                    <li><strong>Adaptive Signal Control:</strong> Traffic signals that adjust their timing in real-time based on actual traffic demand, reducing unnecessary waiting.</li>
                    <li><strong>Variable Message Signs (VMS):</strong> Electronic signs that provide drivers with real-time information about accidents, congestion, or alternative routes.</li>
                    <li><strong>V2X (Vehicle-to-Everything) Communication:</strong> A system allowing vehicles to communicate with each other, with infrastructure, and with pedestrians to prevent accidents and improve flow.</li>
                    <li><strong>AI-Powered Analytics:</strong> Tools like this Traffic Calculator use AI to analyze complex data sets, identify patterns, and suggest improvements that would be difficult for a human to spot.</li>
                </ul>

                <h2>Future Horizons: The Road Ahead</h2>
                <p>
                    The future is set to be even more transformative:
                </p>
                <ul>
                    <li><strong>Autonomous Vehicles (AVs):</strong> Self-driving cars promise to drastically increase road capacity and safety by communicating with each other and eliminating human error.</li>
                    <li><strong>Mobility as a Service (MaaS):</strong> A shift from owning vehicles to using integrated mobility services (like ride-sharing, bike-sharing, and public transit) through a single platform.</li>
                    <li><strong>Predictive Analytics:</strong> Using AI to forecast traffic jams before they happen and proactively rerouting traffic to prevent them.</li>
                    <li><strong>Sustainable Infrastructure:</strong> Roads that can charge electric vehicles as they drive, and cities designed to prioritize walking, cycling, and green public transport over personal cars.</li>
                </ul>

                <h2>Quick Reference Guide</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Term</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>AADT</strong></td>
                            <td>Average Annual Daily Traffic. The total volume of vehicle traffic on a highway or road for a year divided by 365 days.</td>
                        </tr>
                        <tr>
                            <td><strong>LOS</strong></td>
                            <td>Level of Service. A qualitative measure (A-F) describing operational conditions within a traffic stream.</td>
                        </tr>
                        <tr>
                            <td><strong>PCU</strong></td>
                            <td>Passenger Car Unit. A metric used to assess traffic-flow rate on a highway, where different vehicle types are weighted.</td>
                        </tr>
                        <tr>
                            <td><strong>ITS</strong></td>
                            <td>Intelligent Transportation Systems. The application of sensing, analysis, control, and communications technologies to ground transportation.</td>
                        </tr>
                    </tbody>
                </table>
            </article>
        </main>
    );
}
