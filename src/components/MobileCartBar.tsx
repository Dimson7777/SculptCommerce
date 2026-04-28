import { Link, useLocation } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useIsMobile } from "@/hooks/use-mobile";

const HIDDEN_ROUTES = ["/cart", "/checkout"];

const MobileCartBar = () => {
  const { itemCount, total } = useCart();
  const isMobile = useIsMobile();
  const location = useLocation();

  if (!isMobile || itemCount === 0 || HIDDEN_ROUTES.includes(location.pathname)) {
    return null;
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card/95 backdrop-blur-md px-4 py-3 animate-fade-in md:hidden">
      <Link to="/cart">
        <Button className="w-full gap-2 font-heading text-base uppercase tracking-wider" size="lg">
          <ShoppingCart className="h-5 w-5" />
          <span>View Cart ({itemCount})</span>
          <span className="ml-auto">${total.toFixed(2)}</span>
        </Button>
      </Link>
    </div>
  );
};

export default MobileCartBar;
