import { Link } from "react-router-dom";
import { Dumbbell } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-card/30">
    <div className="container mx-auto px-4 py-14">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <Link to="/" className="inline-flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-primary" />
            <span className="font-heading text-base font-bold tracking-tight text-foreground">
              Iron<span className="text-primary">Forge</span>
            </span>
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Simple, well-made gym equipment. No influencer markup, no subscription, no nonsense.
          </p>
        </div>
        <div className="md:col-span-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Shop</h4>
          <ul className="mt-3 space-y-2">
            <li><Link to="/shop" className="text-sm text-foreground/70 transition-colors hover:text-foreground">All Products</Link></li>
            <li><Link to="/shop" className="text-sm text-foreground/70 transition-colors hover:text-foreground">Strength</Link></li>
            <li><Link to="/shop" className="text-sm text-foreground/70 transition-colors hover:text-foreground">Cardio</Link></li>
          </ul>
        </div>
        <div className="md:col-span-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Company</h4>
          <ul className="mt-3 space-y-2">
            <li><Link to="/about" className="text-sm text-foreground/70 transition-colors hover:text-foreground">About</Link></li>
            <li><Link to="/login" className="text-sm text-foreground/70 transition-colors hover:text-foreground">Account</Link></li>
          </ul>
        </div>
        <div className="md:col-span-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Help</h4>
          <ul className="mt-3 space-y-2">
            <li><span className="text-sm text-foreground/70">support@ironforge.com</span></li>
            <li><span className="text-sm text-foreground/70">Mon–Fri, 9am–5pm EST</span></li>
          </ul>
        </div>
      </div>
      <div className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} IronForge. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
