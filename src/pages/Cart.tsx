import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { productImages } from "@/lib/productImages";
import PageTransition from "@/components/PageTransition";

const Cart = () => {
  const { items, removeItem, updateQuantity, total } = useCart();

  if (items.length === 0) {
    return (
      <PageTransition>
        <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4">
          <ShoppingBag className="h-16 w-16 text-muted-foreground" />
          <h2 className="mt-4 font-heading text-2xl font-bold uppercase text-foreground">Cart is empty</h2>
          <p className="mt-2 text-muted-foreground">Add some equipment to get started.</p>
          <Link to="/shop" className="mt-6">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-10">
        <h1 className="font-heading text-4xl font-bold uppercase text-foreground">
          Your <span className="text-primary">Cart</span>
        </h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity }) => {
              const imgSrc = productImages[product.name] ?? product.image_url;
              return (
                <div key={product.id} className="flex gap-4 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/20">
                  <img src={imgSrc} alt={product.name} className="h-24 w-24 rounded-md object-cover" />
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="font-heading text-lg font-semibold uppercase text-foreground">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => updateQuantity(product.id, quantity - 1)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium text-foreground">{quantity}</span>
                        <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => updateQuantity(product.id, quantity + 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="font-heading text-xl font-bold text-primary">${(product.price * quantity).toFixed(2)}</span>
                      <Button variant="ghost" size="icon" onClick={() => removeItem(product.id)} className="text-destructive hover:text-destructive/80">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="h-fit rounded-lg border border-border bg-card p-6">
            <h3 className="font-heading text-xl font-bold uppercase text-foreground">Order Summary</h3>
            <div className="mt-4 space-y-2">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-sm text-muted-foreground">
                  <span>{product.name} x{quantity}</span>
                  <span>${(product.price * quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-border pt-4">
              <div className="flex justify-between font-heading text-xl font-bold">
                <span className="text-foreground">Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <span className="inline-block h-3.5 w-3.5 text-primary">✦</span>
              Free shipping on all orders
            </p>
            <Link to="/checkout" className="mt-4 block">
              <Button className="w-full font-heading text-lg uppercase tracking-wider" size="lg">
                Checkout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Cart;
