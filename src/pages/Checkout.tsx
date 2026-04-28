import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart, type CartItem } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CreditCard, CheckCircle, Package, Copy } from "lucide-react";
import PageTransition from "@/components/PageTransition";

const checkoutSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  address: z.string().trim().min(5, "Address must be at least 5 characters").max(500),
  cardNumber: z.string().regex(/^\d{16}$/, "Card number must be 16 digits"),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format: MM/YY"),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3-4 digits"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

function generateOrderId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "ORD-";
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const orderRef = useRef<{ id: string; items: CartItem[]; total: number; date: string } | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });

  if (items.length === 0 && !success) {
    navigate("/cart");
    return null;
  }

  const onSubmit = async (data: CheckoutForm) => {
    setSubmitting(true);
    const orderItems = items.map((i) => ({
      productId: i.product.id,
      name: i.product.name,
      price: i.product.price,
      quantity: i.quantity,
    }));

    const { error } = await supabase.from("orders").insert({
      customer_name: data.name,
      customer_email: data.email,
      customer_address: data.address,
      items: orderItems,
      total,
    });

    setSubmitting(false);
    if (error) {
      toast.error("Failed to place order. Please try again.");
      return;
    }

    orderRef.current = {
      id: generateOrderId(),
      items: [...items],
      total,
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    };
    clearCart();
    setSuccess(true);
    toast.success("Order placed successfully!");
  };

  if (success && orderRef.current) {
    const order = orderRef.current;
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-lg text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
            <h2 className="mt-6 font-heading text-3xl font-bold uppercase text-foreground">Order Placed Successfully!</h2>
            <p className="mt-2 text-muted-foreground">Thank you for your purchase. Your order is being processed.</p>

            <div className="mt-6 flex items-center justify-center gap-2">
              <span className="text-sm text-muted-foreground">Order ID:</span>
              <code className="rounded bg-secondary px-3 py-1 font-mono text-sm font-bold text-primary">{order.id}</code>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  navigator.clipboard.writeText(order.id);
                  toast.success("Order ID copied!");
                }}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{order.date}</p>
          </div>

          <div className="mx-auto mt-8 max-w-lg rounded-lg border border-border bg-card p-6">
            <h3 className="flex items-center gap-2 font-heading text-lg font-bold uppercase text-foreground">
              <Package className="h-5 w-5 text-primary" />
              Order Summary
            </h3>
            <div className="mt-4 space-y-3">
              {order.items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{product.name} <span className="text-foreground/60">x{quantity}</span></span>
                  <span className="font-medium text-foreground">${(product.price * quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-border pt-4 flex justify-between font-heading text-xl font-bold">
              <span className="text-foreground">Total</span>
              <span className="text-primary">${order.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Button size="lg" onClick={() => navigate("/shop")} className="font-heading uppercase tracking-wider">
              Continue Shopping
            </Button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-10">
        <h1 className="font-heading text-4xl font-bold uppercase text-foreground">
          <span className="text-primary">Checkout</span>
        </h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <h3 className="font-heading text-xl font-semibold uppercase text-foreground">Shipping Info</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" {...register("name")} placeholder="John Doe" />
                  {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register("email")} placeholder="john@example.com" />
                  {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>}
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" {...register("address")} placeholder="123 Main St, City" />
                  {errors.address && <p className="mt-1 text-sm text-destructive">{errors.address.message}</p>}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-heading text-xl font-semibold uppercase text-foreground flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Payment
              </h3>
              <div className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" {...register("cardNumber")} placeholder="4242424242424242" maxLength={16} />
                  {errors.cardNumber && <p className="mt-1 text-sm text-destructive">{errors.cardNumber.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry</Label>
                    <Input id="expiry" {...register("expiry")} placeholder="12/26" maxLength={5} />
                    {errors.expiry && <p className="mt-1 text-sm text-destructive">{errors.expiry.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" {...register("cvv")} placeholder="123" maxLength={4} />
                    {errors.cvv && <p className="mt-1 text-sm text-destructive">{errors.cvv.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full font-heading text-lg uppercase tracking-wider" disabled={submitting}>
              {submitting ? "Processing..." : `Pay $${total.toFixed(2)}`}
            </Button>
          </form>

          <div className="h-fit rounded-lg border border-border bg-card p-6">
            <h3 className="font-heading text-xl font-bold uppercase text-foreground">Order Summary</h3>
            <div className="mt-4 space-y-3">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{product.name} x{quantity}</span>
                  <span className="text-foreground">${(product.price * quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-border pt-4 flex justify-between font-heading text-xl font-bold">
              <span className="text-foreground">Total</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Checkout;
