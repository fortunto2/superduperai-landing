import CustomGoogleTagManager from './google-tag-manager';

interface AnalyticsProvidersProps {
  skipInDevelopment?: boolean;
}

export default function AnalyticsProviders({ 
  skipInDevelopment = true 
}: AnalyticsProvidersProps = {}) {
  return (
    <>
      <CustomGoogleTagManager skipInDevelopment={skipInDevelopment} />
    </>
  );
} 