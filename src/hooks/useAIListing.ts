import { useCallback, useState } from 'react';
import type { AIListingDraft, CategoryKey } from '@/types';

/**
 * Small client-side fallback for the listing assistant. It keeps the form
 * usable when no AI endpoint is configured and provides a safe extension
 * point for a server-side provider later.
 */
export function useAIListing() {
  const [draft, setDraft] = useState<AIListingDraft | null>(null);
  const [loading, setLoading] = useState(false);
  const unavailable = false;

  const generate = useCallback(async (input: string, category?: CategoryKey, subcategory?: string) => {
    const text = input.trim();
    if (!text) return null;
    setLoading(true);
    try {
      const next: AIListingDraft = {
        title: text.length > 80 ? `${text.slice(0, 77)}...` : text,
        description: text,
        category,
        subcategory,
        attributes: {},
        warnings: ['AI xidməti qoşulmadığı üçün mətn avtomatik qaralama kimi əlavə edildi.'],
      };
      setDraft(next);
      return next;
    } finally {
      setLoading(false);
    }
  }, []);

  const improve = useCallback(async (description: string, _category?: CategoryKey | null) => {
    const text = description.trim();
    if (!text) return '';
    setLoading(true);
    try {
      return text.replace(/\s+/g, ' ').trim();
    } finally {
      setLoading(false);
    }
  }, []);

  return { draft, loading, unavailable, generate, improve };
}
