
import React, { createContext, useContext, ReactNode } from 'react';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useSiteLinks } from '@/hooks/useSiteLinks';

interface SiteDataContextType {
  colors: Record<string, string>;
  links: Record<string, string>;
  isLoading: boolean;
}

const SiteDataContext = createContext<SiteDataContextType | undefined>(undefined);

export const SiteDataProvider = ({ children }: { children: ReactNode }) => {
  const { colors: themeColors, isLoading: colorsLoading } = useThemeColors();
  const { getLinksAsObject, isLoading: linksLoading } = useSiteLinks();

  const colors = themeColors.reduce((acc, color) => {
    acc[color.color_key] = color.color_value;
    return acc;
  }, {} as Record<string, string>);

  const links = getLinksAsObject();
  const isLoading = colorsLoading || linksLoading;

  return (
    <SiteDataContext.Provider value={{ colors, links, isLoading }}>
      {children}
    </SiteDataContext.Provider>
  );
};

export const useSiteData = () => {
  const context = useContext(SiteDataContext);
  if (context === undefined) {
    throw new Error('useSiteData must be used within a SiteDataProvider');
  }
  return context;
};
