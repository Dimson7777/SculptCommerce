import { Link } from "react-router-dom";
import { ShoppingCart, Trash2, Plus, Minus, X, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { productImages } from "@/lib/productImages";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const CartDrawer = () => {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-foreground">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground animate-scale-in">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md border-border bg-background">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="font-heading text-xl font-bold uppercase text-foreground">
            Cart ({itemCount})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">Your cart is empty</p>
            <SheetClose asChild>
              <Link to="/shop">
                <Button>Browse Products</Button>
              </Link>
            </SheetClose>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-3">
                {items.map(({ product, quantity }) => {
                  const imgSrc = productImages[product.name] ?? product.image_url;
                  return (
                    <div
                      key={product.id}
                      className="flex gap-3 rounded-lg border border-border bg-card p-3"
                    >
                      <img
                        src={imgSrc}
                        alt={product.name}
                        className="h-16 w-16 rounded-md object-cover"
                      />
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-heading text-sm font-semibold uppercase text-foreground leading-tight">
                              {product.name}
                            </h4>
                            <p className="text-xs text-muted-foreground">{product.category}</p>
                          </div>
                          <button
                            onClick={() => removeItem(product.id)}
                            className="p-1 text-muted-foreground transition-colors hover:text-destructive"
                            aria-label="Remove item"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              className="flex h-6 w-6 items-center justify-center rounded border border-border text-foreground transition-colors hover:bg-secondary"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center text-sm font-medium text-foreground">
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              className="flex h-6 w-6 items-center justify-center rounded border border-border text-foreground transition-colors hover:bg-secondary"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="font-heading text-sm font-bold text-primary">
                            ${(product.price * quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Truck className="h-3.5 w-3.5 text-primary" />
                Free shipping on all orders
              </div>
              <div className="flex justify-between font-heading text-lg font-bold">
                <span className="text-foreground">Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
              <div className="flex gap-2">
                <SheetClose asChild>
                  <Link to="/cart" className="flex-1">
                    <Button variant="outline" className="w-full">View Cart</Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link to="/checkout" className="flex-1">
                    <Button className="w-full font-heading uppercase tracking-wider">Checkout</Button>
                  </Link>
                </SheetClose>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
