import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorStateProps {
  title?: string;
  message?: string;
  error?: Error;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  error,
  onRetry
}: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-red-600">{title}</CardTitle>
          {(message || error) && (
            <CardDescription className="mt-2">
              {message || error?.message}
            </CardDescription>
          )}
        </CardHeader>
        {onRetry && (
          <CardContent className="flex justify-center">
            <Button onClick={onRetry} variant="outline">
              Try Again
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
