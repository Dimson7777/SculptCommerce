import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorState = ({ message = "Something went wrong while loading data.", onRetry }: ErrorStateProps) => (
  <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
      <AlertTriangle className="h-8 w-8 text-destructive" />
    </div>
    <h3 className="mt-4 font-heading text-2xl font-bold uppercase text-foreground">Oops!</h3>
    <p className="mt-2 max-w-md text-muted-foreground">{message}</p>
    {onRetry && (
      <Button variant="outline" className="mt-6 gap-2" onClick={onRetry}>
        <RefreshCw className="h-4 w-4" />
        Try Again
      </Button>
    )}
  </div>
);

export default ErrorState;
