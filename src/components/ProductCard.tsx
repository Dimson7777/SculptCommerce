import { ShoppingCart, Heart, Star, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import type { Tables } from "@/integrations/supabase/types";
import { productImages } from "@/lib/productImages";
import { getProductSignals } from "@/lib/productSignals";
import { toast } from "sonner";

interface Props {
  product: Tables<"products">;
}

const ProductCard = ({ product }: Props) => {
  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();
  const navigate = useNavigate();
  const [justAdded, setJustAdded] = useState(false);
  const wishlisted = isWishlisted(product.id);
  const signals = getProductSignals(product.id, product.category);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
    toast.success(`Added — ${product.name}`, { duration: 2000 });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleItem(product);
  };

  const imgSrc = productImages[product.name] ?? product.image_url;

  return (
    <div
      className="group cursor-pointer overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:border-primary/20 hover:shadow-[0_8px_30px_-12px_hsl(var(--primary)/0.15)]"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
        <img
          src={imgSrc}
          alt={product.name}
          loading="lazy"
          width={512}
          height={640}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {signals.badge && (
          <span className="absolute left-3 top-3 rounded-sm bg-background/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground backdrop-blur-sm">
            {signals.badge}
          </span>
        )}

        <button
          onClick={handleWishlist}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/70 backdrop-blur-sm transition-all duration-200 hover:bg-background/90 active:scale-90"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-3.5 w-3.5 transition-colors duration-200 ${
              wishlisted ? "fill-primary text-primary" : "text-muted-foreground"
            }`}
          />
        </button>

        {signals.stockHint && (
          <span className="absolute bottom-3 left-3 rounded-sm bg-background/85 px-2 py-0.5 text-[10px] font-medium text-primary backdrop-blur-sm">
            {signals.stockHint}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {product.category}
            </p>
            <h3 className="mt-0.5 font-heading text-[15px] font-semibold leading-snug text-foreground">
              {product.name}
            </h3>
          </div>
          <span className="shrink-0 font-heading text-base font-bold text-foreground">
            ${product.price}
          </span>
        </div>

        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span className="font-medium text-foreground">{signals.rating}</span>
            <span>({signals.reviews})</span>
          </span>
          <span className="text-border">·</span>
          <span className="truncate">{signals.benefit}</span>
        </div>

        <Button
          size="sm"
          onClick={handleAdd}
          className="mt-2 h-8 w-full gap-1.5 text-xs font-medium transition-all duration-200 active:scale-[0.98]"
        >
          {justAdded ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Added
            </>
          ) : (
            <>
              <ShoppingCart className="h-3.5 w-3.5" />
              Add to cart
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
