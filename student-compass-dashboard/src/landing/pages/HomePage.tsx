import LandingNav from "@/landing/components/layout/LandingNav";
import HeroExperience from "@/landing/components/sections/HeroExperience";
import SystemFlow from "@/landing/components/sections/SystemFlow";
import EcosystemMap from "@/landing/components/sections/EcosystemMap";
import TechStack from "@/landing/components/sections/TechStack";
import StatsRail from "@/landing/components/sections/StatsRail";
import ClosingCTA, { LandingFooter } from "@/landing/components/sections/ClosingCTA";

export default function HomePage() {
    return (
        <div className="min-h-screen" style={{ backgroundColor: "var(--landing-bg)", color: "var(--landing-text)" }}>
            <LandingNav />
            <HeroExperience />
            <section id="workflow">
                <SystemFlow />
            </section>
            <section id="ecosystem">
                <EcosystemMap />
            </section>
            <section id="stats">
                <StatsRail />
            </section>
            <section id="tech">
                <TechStack />
            </section>
            <ClosingCTA />
            <LandingFooter />
        </div>
    );
}
