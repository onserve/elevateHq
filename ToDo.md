### Project Setup & Configuration

*   [ ] **Initialize Next.js Project:** Set up a new Next.js project with TypeScript and Tailwind CSS.
*   [ ] **Integrate shadcn/ui:** Run the `shadcn/ui` init command to set up components, styles, and `globals.css`.
*   [ ] **Install NextAuth:** Add NextAuth to the project to handle authentication.
*   [ ] **Configure NextAuth with Keycloak:**
    *   [ ] Create a NextAuth configuration file (e.g., `app/api/auth/[...nextauth]/route.ts`).
    *   [ ] Use the Keycloak provider and configure it with your Keycloak realm's details.
    *   [ ] Store Keycloak credentials (client ID, client secret, issuer URL) securely in `.env.local`.
*   [ ] **ESLint & Prettier:** Ensure you have a consistent code style with linting and formatting rules.

### Layout & Core UI

*   [ ] **Root Layout (`app/layout.tsx`):**
    *   [ ] Wrap the main content with necessary providers like `ThemeProvider` (for shadcn/ui) and `SessionProvider` (for NextAuth).
*   [ ] **Header/Navbar Component:**
    *   [ ] Create a responsive navigation bar.
    *   [ ] Include navigation links.
    *   [ ] Add a "Sign In" / "Sign Out" button that conditionally renders based on authentication status.
    *   [ ] Display user information (e.g., name or avatar) when logged in.
*   [ ] **Footer Component:**
    *   [ ] Create a standard footer with copyright information or other links.
*   [ ] **Page Layouts:**
    *   [ ] Define a main content area.
    *   [ ] Consider creating different layout structures if your app has distinct sections (e.g., a dashboard layout vs. a public marketing layout).

### Authentication & Authorization

*   [ ] **Protected Routes:**
    *   [ ] Use Next.js Middleware to protect routes that require authentication.
    *   [ ] Redirect unauthenticated users to a login page or the Keycloak login screen.
*   [ ] **Role-Based Access Control (RBAC):**
    *   [ ] Decode the JWT from Keycloak in the NextAuth `jwt` callback to include user roles.
    *   [ ] Create a custom hook or utility function (e.g., `useCurrentUserRoles`) to easily access roles in components.
    *   [ ] Conditionally render UI elements or restrict page access based on user roles.
*   [ ] **Login Page (Optional):**
    *   [ ] While Keycloak provides a login page, you might create a page at `/login` that explains to the user they are about to be redirected to the authentication server before initiating the `signIn()` flow.

### Reusable Components (with shadcn/ui)

*   [ ] **Forms:**
    *   [ ] Create reusable form components using `react-hook-form` and `zod` for validation, integrated with `shadcn/ui` components (`Input`, `Button`, `Checkbox`, etc.).
*   [ ] **Data Display:**
    *   [ ] Standardize on `Table` for displaying data.
    *   [ ] Use `Card` for displaying information in blocks.
*   [ ] **Feedback & Notifications:**
    *   [ ] Implement `Toast` for showing success, error, or info messages.
    *   [ ] Use `AlertDialog` or `Dialog` for confirmations and modal forms.
*   [ ] **Loading States:**
    *   [ ] Create or use a `Spinner` or `Skeleton` component to indicate loading data.
