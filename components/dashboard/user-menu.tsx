// components/dashboard/user-menu.tsx
'use client';

import { useTransition } from 'react';
import { signOutAction } from '@/lib/auth/actions';
import { LogOut, User, Settings, Shield } from 'lucide-react';
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
  userRoles?: string[];
  /** `sidebar`: full row with name and email. `compact`: avatar only, for the mobile header. */
  variant?: 'sidebar' | 'compact';
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
export function UserMenu({ name, email, image, userRoles = [], variant = 'sidebar' }: UserMenuProps) {
  // Pending while the sign-out action runs; resets by itself if the action fails.
  const [isSigningOut, startSignOut] = useTransition();

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
   * - Keep the menu open (preventDefault on select) so "Signing out..." stays
   *   visible; the action can take a few seconds while Keycloak is called
   * - Run the signOutAction server action (clears the app session and ends
   *   the Keycloak session), which redirects to the home page
   */
  const handleSignOut = (event: Event) => {
    event.preventDefault();
    if (isSigningOut) return;
    startSignOut(async () => {
      await signOutAction();
    });
  };

  const avatar = (
    <Avatar className="h-8 w-8">
      {/* Try to load user's profile image */}
      <AvatarImage src={image || undefined} alt={name} />

      {/* Fallback to initials if no image */}
      <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
        {getUserInitials()}
      </AvatarFallback>
    </Avatar>
  );

  return (
    <div className={variant === 'sidebar' ? 'p-4 border-t border-sidebar-border' : undefined}>
      <DropdownMenu>
        {/* Trigger - shows user avatar (and info in the sidebar variant) */}
        <DropdownMenuTrigger asChild>
          {variant === 'sidebar' ? (
            <Button variant="ghost" className="w-full justify-start gap-3 h-auto p-2">
              {avatar}

              {/* User info */}
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{name}</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">{email}</p>
              </div>
            </Button>
          ) : (
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="Account menu">
              {avatar}
            </Button>
          )}
        </DropdownMenuTrigger>

        {/* Dropdown content */}
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            My Account
            {variant === 'compact' && (
              <span className="block text-xs font-normal text-muted-foreground truncate">{email}</span>
            )}
          </DropdownMenuLabel>
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

          {userRoles.some((r) => ['admin', 'super-admin'].includes(r)) && (
            <DropdownMenuItem>
              <Shield className="mr-2 h-4 w-4" />
              Admin Area
            </DropdownMenuItem>
          )}

          {userRoles.includes('super-admin') && (
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4 text-sidebar-foreground/70" />
              Admin Settings
            </DropdownMenuItem>
          )}

          {(userRoles.some((r) => ['admin', 'super-admin'].includes(r))) && (
            <DropdownMenuSeparator />
          )}

          <DropdownMenuItem onSelect={handleSignOut} aria-disabled={isSigningOut}>
            <LogOut className="mr-2 h-4 w-4" />
            {isSigningOut ? 'Signing out...' : 'Sign out'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
