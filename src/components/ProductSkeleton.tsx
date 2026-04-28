import { Skeleton } from "@/components/ui/skeleton";

const ProductSkeleton = () => (
  <div className="overflow-hidden rounded-lg border border-border bg-card">
    <Skeleton className="aspect-square w-full" />
    <div className="flex flex-col gap-2 p-4">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/2" />
      <div className="mt-2 flex items-center justify-between">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-9 w-16" />
      </div>
    </div>
  </div>
);

export const ProductSkeletonGrid = ({ count = 8 }: { count?: number }) => (
  <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: count }).map((_, i) => (
      <ProductSkeleton key={i} />
    ))}
  </div>
);

export default ProductSkeleton;
