import { useState } from "react";
import { Search, SlidersHorizontal, PackageX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CategoryFilter from "@/components/CategoryFilter";
import ProductCard from "@/components/ProductCard";
import { ProductSkeletonGrid } from "@/components/ProductSkeleton";
import ScrollReveal from "@/components/ScrollReveal";
import ErrorState from "@/components/ErrorState";
import PageTransition from "@/components/PageTransition";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const Shop = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");

  const { data: products, isLoading, isError, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at");
      if (error) throw error;
      return data;
    },
  });

  const categories = [...new Set(products?.map((p) => p.category) ?? [])].sort();

  let filtered = products?.filter((p) => {
    const matchCat = category === "All" || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (filtered) {
    filtered = [...filtered].sort((a, b) => {
      switch (sort) {
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "name": return a.name.localeCompare(b.name);
        default: return 0;
      }
    });
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-10">
        <h1 className="font-heading text-4xl font-bold uppercase text-foreground">
          All <span className="text-primary">Products</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          {isLoading ? "Loading..." : `${filtered?.length ?? 0} products available`}
        </p>

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <CategoryFilter categories={categories} selected={category} onSelect={setCategory} />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-full sm:w-44">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-asc">Price: Low → High</SelectItem>
                <SelectItem value="price-desc">Price: High → Low</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <ProductSkeletonGrid count={8} />
        ) : isError ? (
          <ErrorState message="Failed to load products. Please try again." onRetry={() => refetch()} />
        ) : filtered && filtered.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p, i) => (
              <ScrollReveal key={p.id} delay={i * 50}>
                <ProductCard product={p} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="mt-20 flex flex-col items-center text-center">
            <PackageX className="h-16 w-16 text-muted-foreground" />
            <h3 className="mt-4 font-heading text-2xl font-bold uppercase text-foreground">No Products Found</h3>
            <p className="mt-2 text-muted-foreground">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Shop;
