import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { productImages } from "@/lib/productImages";
import { toast } from "sonner";
import PageTransition from "@/components/PageTransition";
import ScrollReveal from "@/components/ScrollReveal";

const Wishlist = () => {
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (product: typeof items[0]) => {
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-4xl font-bold uppercase text-foreground">
              My <span className="text-primary">Wishlist</span>
            </h1>
            <p className="mt-2 text-muted-foreground">
              {items.length} {items.length === 1 ? "item" : "items"} saved
            </p>
          </div>
          {items.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearWishlist}>
              Clear All
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="mt-20 flex flex-col items-center text-center">
            <Heart className="h-16 w-16 text-muted-foreground" />
            <h3 className="mt-4 font-heading text-2xl font-bold uppercase text-foreground">
              Your wishlist is empty
            </h3>
            <p className="mt-2 text-muted-foreground">
              Browse our shop and save your favorite items here.
            </p>
            <Button className="mt-6" onClick={() => navigate("/shop")}>
              Browse Shop
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((product, i) => {
              const imgSrc = productImages[product.name] ?? product.image_url;
              return (
                <ScrollReveal key={product.id} delay={i * 50}>
                  <div className="group overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                    <div
                      className="relative aspect-square cursor-pointer overflow-hidden bg-secondary"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      <img
                        src={imgSrc}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <span className="absolute left-3 top-3 rounded-sm bg-primary px-2 py-0.5 font-heading text-xs font-semibold uppercase text-primary-foreground">
                        {product.category}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2 p-4">
                      <h3 className="font-heading text-lg font-semibold uppercase text-foreground">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-heading text-2xl font-bold text-primary">
                          ${product.price}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeItem(product.id)}
                            className="text-destructive hover:text-destructive/80"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(product)}
                            className="gap-1 active:scale-95 transition-transform"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Wishlist;
