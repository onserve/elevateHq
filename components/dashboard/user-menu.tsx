// components/dashboard/user-menu.tsx
'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { LogOut, User, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UserMenuProps {
  name: string;
  email: string;
  image?: string | null;
}

/**
 * UserMenu - Client Component for user dropdown
 *
 * Why is this a Client Component?
 * - Needs onClick handlers (signOut)
 * - Manages dropdown open/close state
 * - Interactive UI that responds to user actions
 *
 * Props vs Context:
 * - We receive user data as PROPS (not from useSession)
 * - Parent (Server Component) fetched the data
 * - Props are passed down the tree
 * - This is more efficient than context
 *
 * Data Flow:
 * Layout (Server)
 *   → await auth()
 *   → gets session
 *   → passes to Sidebar
 *   → passes to UserMenu as props
 */
export function UserMenu({ name, email, image }: UserMenuProps) {
  // Local state for loading indicator
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Generate user initials from name
   * e.g., "John Doe" → "JD"
   */
  const getUserInitials = () => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  /**
   * Handle sign out
   * - Set loading state (disable button, show loading text)
   * - Call NextAuth signOut()
   * - Redirect to home page
   */
  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut({ callbackUrl: '/' });
    // Note: setIsLoading(false) not needed - user will be redirected
  };

  return (
    <div className="p-4 border-t border-sidebar-border">
      <DropdownMenu>
        {/* Trigger - shows user avatar and info */}
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full justify-start gap-3 h-auto p-2">
            <Avatar className="h-8 w-8">
              {/* Try to load user's profile image */}
              <AvatarImage src={image || undefined} alt={name} />

              {/* Fallback to initials if no image */}
              <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>

            {/* User info */}
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{name}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">{email}</p>
            </div>
          </Button>
        </DropdownMenuTrigger>

        {/* Dropdown content */}
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleSignOut} disabled={isLoading}>
            <LogOut className="mr-2 h-4 w-4" />
            {isLoading ? 'Signing out...' : 'Sign out'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
