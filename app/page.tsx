import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth'
import { Shield, Users, Database, Lock } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SignInButton } from '@/components/auth/sign-in-button';

export default async function HomePage() {
  const session = await auth();

  // Server-side redirect if already authenticated
  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-accent/10 rounded-full">
                <Shield className="h-16 w-16 text-accent" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Life Admin
              <span className="text-accent block">Your Personal Command Center</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
              Manage your finances, track projects, achieve goals, and organize tasks all in one
              secure platform. Built for entrepreneurs and ambitious individuals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SignInButton />
              <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-card-foreground mb-4">
              Enterprise Security Features
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Built with modern security standards and best practices for enterprise applications.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border">
              <CardHeader>
                <div className="p-2 bg-accent/10 rounded-lg w-fit">
                  <Lock className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>OAuth2 PKCE</CardTitle>
                <CardDescription>
                  Secure authorization code flow with Proof Key for Code Exchange for enhanced
                  security.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="p-2 bg-accent/10 rounded-lg w-fit">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Keycloak Integration</CardTitle>
                <CardDescription>
                  Seamless integration with Keycloak identity provider for centralized user
                  management.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="p-2 bg-accent/10 rounded-lg w-fit">
                  <Database className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Secure Token Storage</CardTitle>
                <CardDescription>
                  HTTP-only cookies with automatic refresh and secure session management.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
