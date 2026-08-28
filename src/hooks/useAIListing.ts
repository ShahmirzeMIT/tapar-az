import { useCallback, useState } from 'react';
import { generateListingDraft, improveDescription, GeminiUnavailableError } from '@/utils/gemini';
import type { AIListingDraft, CategoryKey } from '@/types';

/**
 * Wraps Gemini calls for the AI listing assistant (PRD §7).
 * The draft is ALWAYS returned to the caller for user review — this hook
 * never writes to Firestore or publishes anything itself.
 */
export function useAIListing() {
  const [draft, setDraft] = useState<AIListingDraft | null>(null);
  const [loading, setLoading] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (userInput: string) => {
    setLoading(true);
    setError(null);
    setUnavailable(false);
    try {
      const result = await generateListingDraft(userInput);
      setDraft(result);
      return result;
    } catch (e) {
      if (e instanceof GeminiUnavailableError) {
        setUnavailable(true);
        setError(e.message);
      } else {
        setError(e instanceof Error ? e.message : 'Naməlum xəta baş verdi.');
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const improve = useCallback(async (text: string, category: CategoryKey | null) => {
    setLoading(true);
    setError(null);
    setUnavailable(false);
    try {
      return await improveDescription(text, category);
    } catch (e) {
      if (e instanceof GeminiUnavailableError) {
        setUnavailable(true);
        setError(e.message);
      } else {
        setError(e instanceof Error ? e.message : 'Naməlum xəta baş verdi.');
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = () => { setDraft(null); setError(null); setUnavailable(false); };

  return { draft, setDraft, loading, unavailable, error, generate, improve, reset };
}
