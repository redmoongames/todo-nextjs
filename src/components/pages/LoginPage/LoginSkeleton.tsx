import { Skeleton } from '../../ui/Skeleton';

export function LoginSkeleton() {
  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-6">
      <div className="max-w-lg mx-auto bg-gray-800 rounded-xl shadow-xl p-6 md:p-8 border border-gray-700">
        <div className="text-center mb-8">
          {/* Title */}
          <Skeleton className="h-10 w-48 mx-auto mb-4" />
          
          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6 mx-auto" />
            <Skeleton className="h-4 w-1/6 mx-auto" />
            <Skeleton className="h-4 w-4/6 mx-auto" />
            <Skeleton className="h-4 w-5/6 mx-auto" />
            <Skeleton className="h-4 w-3/6 mx-auto" />
            <Skeleton className="h-4 w-4/6 mx-auto" />
            <Skeleton className="h-4 w-5/6 mx-auto" />
          </div>
        </div>

        <div className="space-y-6 max-w-md mx-auto">
          <div className="space-y-4">
            {/* Input fields */}
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Sticky note */}
      <div className="max-w-md mx-auto relative">
        <div className="absolute -right-4 md:right-4 top-4">
          <Skeleton className="h-48 w-48 rotate-6" />
        </div>
      </div>
    </div>
  );
} 