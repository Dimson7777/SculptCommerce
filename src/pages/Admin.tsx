import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Package, ShoppingBag, DollarSign, Layers } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import PageTransition from "@/components/PageTransition";

type Product = Tables<"products">;

const StatCard = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) => (
  <div className="rounded-lg border border-border bg-card p-5">
    <div className="flex items-center gap-3">
      <Icon className="h-6 w-6 text-primary" />
      <div>
        <p className="text-xs uppercase text-muted-foreground">{label}</p>
        <p className="font-heading text-2xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  </div>
);

const ProductForm = ({
  form,
  setForm,
  editing,
  onSave,
  onCancel,
  saving,
}: {
  form: { name: string; description: string; price: string; category: string; image_url: string };
  setForm: (f: typeof form) => void;
  editing: boolean;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}) => (
  <div className="rounded-lg border border-border bg-card p-6">
    <h3 className="font-heading text-xl font-semibold uppercase text-foreground">
      {editing ? "Edit Product" : "Add New Product"}
    </h3>
    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      <div>
        <Label>Name</Label>
        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Product name" />
      </div>
      <div>
        <Label>Category</Label>
        <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Strength" />
      </div>
      <div>
        <Label>Price ($)</Label>
        <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0.00" />
      </div>
      <div>
        <Label>Image URL</Label>
        <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
      </div>
      <div className="sm:col-span-2">
        <Label>Description</Label>
        <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short product description" />
      </div>
    </div>
    <div className="mt-4 flex gap-2">
      <Button onClick={onSave} disabled={saving || !form.name || !form.price} className="active:scale-95 transition-transform">
        <Plus className="mr-1 h-4 w-4" />
        {editing ? "Update" : "Add"} Product
      </Button>
      {editing && <Button variant="secondary" onClick={onCancel}>Cancel</Button>}
    </div>
  </div>
);

const Admin = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "", image_url: "https://via.placeholder.com/150" });

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at");
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  const { data: orders } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(10);
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted");
    },
    onError: () => toast.error("Failed to delete product"),
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        category: form.category.trim(),
        image_url: form.image_url.trim(),
      };
      if (editing) {
        const { error } = await supabase.from("products").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(editing ? "Product updated" : "Product added");
      resetForm();
    },
    onError: () => toast.error("Failed to save product"),
  });

  const resetForm = () => {
    setEditing(null);
    setForm({ name: "", description: "", price: "", category: "", image_url: "https://via.placeholder.com/150" });
  };

  const startEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description, price: String(p.price), category: p.category, image_url: p.image_url });
  };

  if (authLoading) return (
    <div className="container mx-auto px-4 py-10">
      <Skeleton className="h-10 w-64" />
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Skeleton className="h-28" /><Skeleton className="h-28" /><Skeleton className="h-28" />
      </div>
    </div>
  );

  if (!isAdmin) {
    navigate("/login");
    return null;
  }

  const totalRevenue = orders?.reduce((s, o) => s + o.total, 0) ?? 0;
  const totalProducts = products?.length ?? 0;
  const totalOrders = orders?.length ?? 0;
  const categories = new Set(products?.map((p) => p.category)).size;

  return (
    <PageTransition>
    <div className="container mx-auto px-4 py-10">
      <h1 className="font-heading text-4xl font-bold uppercase text-foreground flex items-center gap-3">
        <Package className="h-8 w-8 text-primary" />
        Admin <span className="text-primary">Dashboard</span>
      </h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={ShoppingBag} label="Total Products" value={totalProducts} />
        <StatCard icon={Layers} label="Categories" value={categories} />
        <StatCard icon={DollarSign} label="Revenue" value={`$${totalRevenue.toFixed(0)}`} />
        <StatCard icon={Package} label="Recent Orders" value={totalOrders} />
      </div>

      <div className="mt-8">
        <ProductForm
          form={form}
          setForm={setForm}
          editing={!!editing}
          onSave={() => saveMutation.mutate()}
          onCancel={resetForm}
          saving={saveMutation.isPending}
        />
      </div>

      {orders && orders.length > 0 && (
        <div className="mt-8 rounded-lg border border-border bg-card p-6">
          <h3 className="font-heading text-xl font-semibold uppercase text-foreground">Recent Orders</h3>
          <div className="mt-4 space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded-md border border-border bg-secondary/50 p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{o.customer_name}</p>
                  <p className="text-xs text-muted-foreground">{o.customer_email}</p>
                </div>
                <div className="text-right">
                  <p className="font-heading font-bold text-primary">${o.total.toFixed(2)}</p>
                  <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <h3 className="font-heading text-xl font-semibold uppercase text-foreground">All Products</h3>
        {isLoading ? (
          <div className="mt-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        ) : products?.length === 0 ? (
          <p className="mt-4 text-muted-foreground">No products yet. Add your first product above.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {products?.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/30">
                <div className="flex-1">
                  <h4 className="font-heading font-semibold text-foreground">{p.name}</h4>
                  <p className="text-sm text-muted-foreground">{p.category} · ${p.price}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="icon" onClick={() => startEdit(p)} className="hover:text-primary transition-colors">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete "{p.name}"?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently remove this product. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMutation.mutate(p.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </PageTransition>
  );
};

export default Admin;
