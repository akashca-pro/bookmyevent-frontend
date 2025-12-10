import { Hero } from "../components/Hero";
import { Features } from "../components/Features";

export const LandingPage = () => {
    return (
        <div className="overflow-x-hidden">
            <Hero />
            <Features />
            <div className="h-20" /> {/* Spacer */}
        </div>
    );
};
