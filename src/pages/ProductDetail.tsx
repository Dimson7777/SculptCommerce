import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { productImages } from "@/lib/productImages";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/ProductCard";
import ScrollReveal from "@/components/ScrollReveal";
import ErrorState from "@/components/ErrorState";
import PageTransition from "@/components/PageTransition";
import { ShoppingCart, ArrowLeft, Plus, Minus, Star, Truck, Shield, RotateCcw, Heart } from "lucide-react";
import { toast } from "sonner";
import { getProductSignals } from "@/lib/productSignals";

const mockReviews = [
  { id: 1, name: "Alex M.", rating: 5, date: "2 weeks ago", text: "Honestly thought this would feel cheap for the price. It doesn't. Been using it 4x a week, no complaints." },
  { id: 2, name: "Sarah K.", rating: 4, date: "1 month ago", text: "Solid. Took one star off because shipping took 6 days, not 3. Product itself is great." },
  { id: 3, name: "Mike R.", rating: 5, date: "1 month ago", text: "Bought it for my garage setup. Holds up fine under heavy use. Would buy from them again." },
  { id: 4, name: "Jordan T.", rating: 4, date: "2 months ago", text: "Does what it says. Nothing fancy, just well made. That's what I wanted." },
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [zoomed, setZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const { data: product, isLoading, isError, refetch } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: relatedProducts } = useQuery({
    queryKey: ["related-products", product?.category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", product!.category)
        .neq("id", product!.id)
        .limit(4);
      if (error) throw error;
      return data;
    },
    enabled: !!product,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Skeleton className="mb-6 h-10 w-24" />
        <div className="grid gap-10 md:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-12 w-40" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-10">
          <ErrorState message="Failed to load product details." onRetry={() => refetch()} />
        </div>
      </PageTransition>
    );
  }

  if (!product) {
    return (
      <PageTransition>
        <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4">
          <p className="text-muted-foreground">Product not found.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/shop")}>Back to Shop</Button>
        </div>
      </PageTransition>
    );
  }

  const imgSrc = productImages[product.name] ?? product.image_url;
  const signals = getProductSignals(product.id, product.category);
  const avgRating = signals.rating.toFixed(1);

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) addItem(product);
    toast.success(`${quantity}x ${product.name} added to cart`);
    setQuantity(1);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-10">
        <Button
          variant="ghost"
          className="mb-6 gap-2 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="grid gap-10 md:grid-cols-2">
          {/* Zoomable Image */}
          <div
            className="relative cursor-zoom-in overflow-hidden rounded-lg border border-border bg-secondary"
            onMouseEnter={() => setZoomed(true)}
            onMouseLeave={() => setZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              src={imgSrc}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300"
              style={zoomed ? { transform: "scale(2)", transformOrigin: `${mousePos.x}% ${mousePos.y}%` } : {}}
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center gap-4">
            <span className="w-fit rounded-sm bg-primary px-3 py-1 font-heading text-xs font-semibold uppercase text-primary-foreground">
              {product.category}
            </span>
            <h1 className="font-heading text-4xl font-bold uppercase text-foreground">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`h-5 w-5 ${s <= Math.round(Number(avgRating)) ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{avgRating} ({signals.reviews} reviews)</span>
            </div>

            <p className="text-base leading-relaxed text-muted-foreground">{product.description}</p>

            <div className="rounded-md border border-border bg-card/50 p-3 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{signals.benefit}</span>
              {signals.stockHint && (
                <>
                  <span className="mx-2 text-border">·</span>
                  <span className="text-primary">{signals.stockHint}</span>
                </>
              )}
            </div>

            <span className="font-heading text-4xl font-bold text-primary">${product.price}</span>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-foreground">Quantity:</span>
              <div className="flex items-center rounded-md border border-border">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium text-foreground">{quantity}</span>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none" onClick={() => setQuantity((q) => q + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-2 flex items-center gap-3">
              <Button size="lg" onClick={handleAdd} className="w-fit gap-2 font-heading uppercase tracking-wider active:scale-95 transition-transform">
                <ShoppingCart className="h-5 w-5" />
                Add to Cart — ${(product.price * quantity).toFixed(2)}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  toggleItem(product);
                  toast.success(isWishlisted(product.id) ? `${product.name} removed from wishlist` : `${product.name} added to wishlist`);
                }}
                className={`gap-2 active:scale-95 transition-transform ${isWishlisted(product.id) ? "border-primary text-primary" : ""}`}
              >
                <Heart className={`h-5 w-5 transition-colors ${isWishlisted(product.id) ? "fill-primary text-primary" : ""}`} />
                {isWishlisted(product.id) ? "Wishlisted" : "Wishlist"}
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-4 flex flex-wrap gap-6 border-t border-border pt-4">
              {[
                { icon: Truck, label: "Free Shipping" },
                { icon: Shield, label: "2-Year Warranty" },
                { icon: RotateCcw, label: "30-Day Returns" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon className="h-4 w-4 text-primary" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <ScrollReveal className="mt-16">
          <h2 className="font-heading text-2xl font-bold uppercase text-foreground">
            Customer <span className="text-primary">Reviews</span>
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {mockReviews.map((r) => (
              <div key={r.id} className="rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-heading text-sm font-bold text-primary">
                      {r.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.date}</p>
                    </div>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`h-3.5 w-3.5 ${s <= r.rating ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{r.text}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <ScrollReveal className="mt-16">
            <h2 className="font-heading text-2xl font-bold uppercase text-foreground">
              Related <span className="text-primary">Products</span>
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </ScrollReveal>
        )}
      </div>
    </PageTransition>
  );
};

export default ProductDetail;
