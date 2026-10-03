import { PlanPageClient } from '@/components/plan/PlanPageClient';

export const metadata = {
  title: 'Plan | Smartli',
  description: 'View your current Smartli subscription and upgrade your plan.',
};

export default function PlanPage() {
  return <PlanPageClient />;
}
