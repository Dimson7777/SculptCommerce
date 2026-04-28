import ScrollReveal from "@/components/ScrollReveal";
import PageTransition from "@/components/PageTransition";

const About = () => (
  <PageTransition>
    <div className="container mx-auto max-w-3xl px-4 py-20">
      <ScrollReveal>
        <p className="text-xs font-medium uppercase tracking-widest text-primary">
          About IronForge
        </p>
        <h1 className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl">
          A small store for people who actually train.
        </h1>
      </ScrollReveal>

      <ScrollReveal delay={80}>
        <div className="mt-10 space-y-5 text-base leading-relaxed text-muted-foreground">
          <p>
            IronForge started in a one-car garage in 2020. I'd just spent
            $400 on a barbell that bent after a month, and I was tired of
            guessing which gear was actually built and which was just dressed
            up to look like it.
          </p>
          <p>
            So I started ordering things, testing them, and keeping a short
            list of what held up. Friends started asking where I got my stuff.
            That list became this store.
          </p>
          <p>
            We're still small. Every product here has been used in a real
            session — not just photographed in a studio. If something doesn't
            survive a year of honest training, it doesn't make the cut.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={160}>
        <div className="mt-12 grid gap-6 border-t border-border pt-10 sm:grid-cols-3">
          <div>
            <p className="font-heading text-2xl font-bold text-foreground">42</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
              Products we'd buy ourselves
            </p>
          </div>
          <div>
            <p className="font-heading text-2xl font-bold text-foreground">~2,000</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
              Orders shipped so far
            </p>
          </div>
          <div>
            <p className="font-heading text-2xl font-bold text-foreground">3</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
              People behind the store
            </p>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={220}>
        <div className="mt-12 rounded-lg border border-border bg-card p-6">
          <p className="font-heading text-sm font-semibold text-foreground">
            What we won't do
          </p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>· Sell anything we haven't tested ourselves.</li>
            <li>· Run fake countdown timers or "97% off" gimmicks.</li>
            <li>· Make returns awkward. Email us, we'll sort it out.</li>
          </ul>
        </div>
      </ScrollReveal>
    </div>
  </PageTransition>
);

export default About;
