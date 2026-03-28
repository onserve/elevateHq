import { CheckCircle2, Zap, BarChart3, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

/**
 * DocumentStats - AI Agent capabilities display
 *
 * This component showcases the AI agent's features and readiness
 * Static component - no interactivity needed
 *
 * TODO: Could be enhanced with:
 * - Real-time agent status from API: GET /api/ai/status
 * - Recent processing stats (documents processed today, etc.)
 * - Agent version/model information
 */
export function DocumentStats() {
  const features = [
    {
      icon: BarChart3,
      text: 'Trained on financial documents',
    },
    {
      icon: CheckCircle2,
      text: 'Extracts dates, amounts, and vendors',
    },
    {
      icon: BarChart3,
      text: 'Categorizes transactions automatically',
    },
    {
      icon: Sparkles,
      text: 'Provides confidence scores',
    },
  ];

  return (
    <Card className="border border-border bg-card shadow-sm h-full">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3 mb-6">
          <div className="p-2 bg-accent/10 rounded-lg flex-shrink-0">
            <Zap className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI Agent Ready</h3>
            <p className="text-xs text-accent mt-1">Status: Online</p>
          </div>
        </div>

        <div className="space-y-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex items-start gap-2">
                <Icon className="h-4 w-4 text-accent flex-shrink-0 mt-1" />
                <span className="text-xs lg:text-sm text-muted-foreground">{feature.text}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
