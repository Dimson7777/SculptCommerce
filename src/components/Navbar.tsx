import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Dumbbell, Shield, Menu, X, Heart } from "lucide-react";
import CartDrawer from "@/components/CartDrawer";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
];

const Navbar = () => {
  const { itemCount: wishlistCount } = useWishlist();
  const { user, isAdmin, signOut } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Dumbbell className="h-5 w-5 text-primary" />
          <span className="font-heading text-base font-bold tracking-tight text-foreground">
            Iron<span className="text-primary">Forge</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                location.pathname === l.to
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1 rounded-md px-3 py-1.5 text-[13px] font-medium text-primary transition-colors hover:text-primary/80"
            >
              <Shield className="h-3.5 w-3.5" />
              Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-1">
          {user ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="hidden h-8 text-xs text-muted-foreground hover:text-foreground md:inline-flex"
            >
              Sign Out
            </Button>
          ) : (
            <Link to="/login" className="hidden md:inline-flex">
              <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-foreground">
                Sign In
              </Button>
            </Link>
          )}
          <Link to="/wishlist" className="relative">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <Heart className="h-4 w-4" />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-scale-in">
                  {wishlistCount}
                </span>
              )}
            </Button>
          </Link>
          <CartDrawer />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 md:hidden"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border bg-background px-4 pb-4 pt-3 md:hidden animate-fade-in">
          <div className="flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  location.pathname === l.to
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-primary"
              >
                Admin
              </Link>
            )}
            {user ? (
              <button
                onClick={() => { signOut(); setOpen(false); }}
                className="rounded-md px-3 py-2 text-left text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
