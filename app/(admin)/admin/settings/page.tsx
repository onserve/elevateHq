import { Settings, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground">
          Manage global configurations and advanced administrative parameters.
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            General Configuration
          </CardTitle>
          <CardDescription>
            Update application-wide settings. These changes affect all users.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="app-name">Application Name</Label>
            <Input id="app-name" defaultValue="ElevateHQ Dashboard" disabled />
            <p className="text-xs text-muted-foreground">The name displayed in the browser tab and navigation.</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="support-email">Support Contact Email</Label>
            <Input id="support-email" defaultValue="support@elevatehq.com" disabled />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button disabled>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
