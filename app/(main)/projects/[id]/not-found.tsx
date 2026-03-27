import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-full flex items-center justify-center p-8">
      <div className="text-center space-y-4">
        <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto opacity-50" />
        <h1 className="text-2xl lg:text-4xl font-bold text-foreground">Project Not Found</h1>
        <p className="text-muted-foreground max-w-md">
          The project you're looking for doesn't exist or has been deleted.
        </p>
        <div className="pt-4">
          <Link href="/projects">
            <Button className="bg-accent hover:bg-accent/90">
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
