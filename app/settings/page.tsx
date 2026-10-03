import { SettingsPageClient } from '@/components/settings/settings-page-client';

export const metadata = {
  title: 'Settings | Smartli',
  description: 'Manage your Smartli plan usage, preferences and privacy.',
};

export default function SettingsPage() {
  return <SettingsPageClient />;
}
