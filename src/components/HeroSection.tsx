import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero-gym.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-end overflow-hidden">
      <img
        src={heroImg}
        alt="Gym equipment"
        className="absolute inset-0 h-full w-full object-cover"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
      
      <div className="container relative z-10 mx-auto px-4 pb-20 pt-32">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Now shipping across the US
          </div>
          
          <h1 className="font-heading text-4xl font-bold leading-[1.1] text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Built for real
            <br />
            training.
          </h1>
          
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            Simple gear that holds up over time. No cheap materials, no markup, no fluff.
          </p>
          
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="/shop">
              <Button size="lg" className="h-12 gap-2 rounded-lg px-6 font-heading text-sm font-semibold uppercase tracking-wide transition-all duration-200 hover:gap-3 active:scale-[0.98]">
                Browse Equipment
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="ghost" size="lg" className="h-12 rounded-lg px-6 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Our Story
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
