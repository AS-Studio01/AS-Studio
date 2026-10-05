import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SiteContent, DEFAULT_SITE_CONTENT, getSiteContent, saveSiteContent, saveLegalDocument, LegalDocumentKey, LegalEntry } from '../services/siteContent';

interface SiteContentContextType {
  content: SiteContent;
  loading: boolean;
  updateContent: (newContent: SiteContent | ((prev: SiteContent) => SiteContent)) => void;
  saveContent: (newContent: SiteContent) => Promise<void>;
  saveDocument: (key: LegalDocumentKey, doc: LegalEntry) => Promise<void>;
  refresh: () => Promise<void>;
}

const defaultContextValue: SiteContentContextType = {
  content: DEFAULT_SITE_CONTENT,
  loading: false,
  updateContent: () => {},
  saveContent: async () => {},
  saveDocument: async () => {},
  refresh: async () => {},
};

export const SiteContentContext = createContext<SiteContentContextType>(defaultContextValue);

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const data = await getSiteContent();
      setContent(data);
    } catch (err) {
      console.warn('[SiteContentContext] Could not load remote content, using fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const updateContent = (newContent: SiteContent | ((prev: SiteContent) => SiteContent)) => {
    setContent(newContent);
  };

  const handleSaveContent = async (newContent: SiteContent) => {
    setContent(newContent);
    await saveSiteContent(newContent);
  };

  const handleSaveDocument = async (key: LegalDocumentKey, doc: LegalEntry) => {
    setContent((prev) => ({
      ...prev,
      legal: {
        ...prev.legal,
        [key]: doc,
      },
    }));
    await saveLegalDocument(key, doc);
  };

  return (
    <SiteContentContext.Provider
      value={{
        content,
        loading,
        updateContent,
        saveContent: handleSaveContent,
        saveDocument: handleSaveDocument,
        refresh,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  return context || defaultContextValue;
}
