const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-lg bg-surface-container-high ${className}`} />
);

export const SkeletonCard = () => (
  <div className="bg-surface-container-low rounded-lg p-6 space-y-4">
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-8 w-1/2" />
    <Skeleton className="h-2 w-full" />
  </div>
);

export const SkeletonText = ({ lines = 3 }: { lines?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} className={`h-3 ${i === lines - 1 ? "w-2/3" : "w-full"}`} />
    ))}
  </div>
);

export const SkeletonAvatar = ({ size = "w-10 h-10" }: { size?: string }) => (
  <Skeleton className={`${size} rounded-full`} />
);

export default Skeleton;
