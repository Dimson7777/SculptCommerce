import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import { ProductSkeletonGrid } from "@/components/ProductSkeleton";
import ScrollReveal from "@/components/ScrollReveal";
import ErrorState from "@/components/ErrorState";
import PageTransition from "@/components/PageTransition";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Package, Truck, ShieldCheck, RefreshCw } from "lucide-react";

const promises = [
  {
    icon: Package,
    title: "Built to last",
    desc: "Commercial-grade steel and rubber. The same stuff you'd find in a real gym.",
  },
  {
    icon: Truck,
    title: "Free shipping over $100",
    desc: "Tracked delivery to your door. Most orders arrive within 3–5 business days.",
  },
  {
    icon: ShieldCheck,
    title: "2-year warranty",
    desc: "Something break? We'll replace it. No hoops, no forms, no waiting.",
  },
  {
    icon: RefreshCw,
    title: "30-day returns",
    desc: "Not what you expected? Send it back. We cover return shipping.",
  },
];

const Index = () => {
  const { data: products, isLoading, isError, refetch } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").limit(8);
      if (error) throw error;
      return data;
    },
  });

  return (
    <PageTransition>
      <HeroSection />

      {/* Trust bar */}
      <section className="border-y border-border bg-card/50">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {promises.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 60}>
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-heading text-sm font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-20">
        <ScrollReveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-primary">
                What's moving this week
              </p>
              <h2 className="mt-2 font-heading text-2xl font-bold text-foreground sm:text-3xl">
                Stuff people keep buying
              </h2>
            </div>
            <Link to="/shop" className="hidden sm:block">
              <Button variant="ghost" className="gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
                See everything <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </ScrollReveal>

        {isLoading ? (
          <ProductSkeletonGrid count={4} />
        ) : isError ? (
          <ErrorState message="Couldn't load products right now." onRetry={() => refetch()} />
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products?.map((p, i) => (
              <ScrollReveal key={p.id} delay={i * 60}>
                <ProductCard product={p} />
              </ScrollReveal>
            ))}
          </div>
        )}

        <Link to="/shop" className="mt-8 flex justify-center sm:hidden">
          <Button variant="outline" className="gap-1.5">
            See all products <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="container mx-auto px-4 py-20">
          <ScrollReveal>
            <div className="mx-auto max-w-xl text-center">
              <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl text-balance">
                Start with one piece.
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                Most people pick one thing, use it for a month, and come back for the next. No need to buy a whole setup at once.
              </p>
              <Link to="/shop" className="mt-8 inline-block">
                <Button size="lg" className="h-12 gap-2 rounded-lg px-6 font-heading text-sm font-semibold uppercase tracking-wide transition-all duration-200 hover:gap-3 active:scale-[0.98]">
                  Start Shopping
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageTransition>
  );
};

export default Index;
