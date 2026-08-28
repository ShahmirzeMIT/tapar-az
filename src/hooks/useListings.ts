import { useCallback, useEffect, useRef, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';

import { db } from '@/firebase/config';
import type { CategoryKey, Listing, ListingAttributes } from '@/types';

export interface ListingFilters {
  category?: CategoryKey;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'newest' | 'cheapest' | 'expensive' | 'most_viewed' | 'top_rated';
  searchTerm?: string;
  subcategory?: string;
  attributes?: ListingAttributes;
}

const PAGE_SIZE = 20;

function numericValue(value: unknown): number {
  if (typeof value === 'number') return value;
  if (value && typeof (value as { toMillis?: () => number }).toMillis === 'function') {
    return (value as { toMillis: () => number }).toMillis();
  }
  return 0;
}

export function useListings(filters: ListingFilters) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const allListingsRef = useRef<Listing[]>([]);
  const visibleCountRef = useRef(PAGE_SIZE);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Only status is queried server-side: this uses Firestore's built-in
      // single-field index and does not require a composite index.
      const snapshot = await getDocs(
        query(collection(db, 'listings'), where('status', '==', 'active'))
      );
      let docs = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as Listing
      );

      if (filters.category) docs = docs.filter((listing) => listing.category === filters.category);
      if (filters.subcategory) docs = docs.filter((listing) => listing.subcategory === filters.subcategory);
      if (filters.city) docs = docs.filter((listing) => listing.city === filters.city);
      if (filters.minPrice !== undefined) {
        docs = docs.filter((listing) => numericValue(listing.price) >= filters.minPrice!);
      }
      if (filters.maxPrice !== undefined) {
        docs = docs.filter((listing) => numericValue(listing.price) <= filters.maxPrice!);
      }
      if (filters.searchTerm?.trim()) {
        const search = filters.searchTerm.trim().toLowerCase();
        docs = docs.filter((listing) =>
          String(listing.title ?? '').toLowerCase().includes(search) ||
          String(listing.description ?? '').toLowerCase().includes(search)
        );
      }

      if (filters.attributes) {
        docs = docs.filter((listing) => Object.entries(filters.attributes!).every(([name, selected]) => {
          if (selected === undefined || selected === '' || selected === false) return true;
          const actual = listing.attributes?.[name];
          if (Array.isArray(selected)) {
            if (selected.length === 0) return true;
            return selected.every((value) => Array.isArray(actual) && actual.includes(value));
          }
          if (typeof selected === 'string' && typeof actual === 'string') {
            return actual.toLowerCase().includes(selected.toLowerCase());
          }
          return actual === selected;
        }));
      }

      docs.sort((a, b) => {
        switch (filters.sort) {
          case 'cheapest': return numericValue(a.price) - numericValue(b.price);
          case 'expensive': return numericValue(b.price) - numericValue(a.price);
          case 'most_viewed': return numericValue(b.viewCount) - numericValue(a.viewCount);
          case 'top_rated': return numericValue(b.ratingAvg) - numericValue(a.ratingAvg);
          case 'newest':
          default: return numericValue(b.createdAt) - numericValue(a.createdAt);
        }
      });

      allListingsRef.current = docs;
      visibleCountRef.current = PAGE_SIZE;
      setListings(docs.slice(0, PAGE_SIZE));
      setHasMore(docs.length > PAGE_SIZE);
    } catch (err) {
      console.error('Failed to load listings:', err);
      setError(err instanceof Error ? err.message : 'Elanları yükləmək mümkün olmadı.');
    } finally {
      setLoading(false);
    }
  }, [filters.category, filters.city, filters.minPrice, filters.maxPrice, filters.sort, filters.searchTerm, filters.subcategory, filters.attributes]);

  useEffect(() => {
    void fetchListings();
  }, [fetchListings]);

  const loadMore = useCallback(() => {
    if (loading || loadingMore || !hasMore) return;
    setLoadingMore(true);
    visibleCountRef.current += PAGE_SIZE;
    const nextListings = allListingsRef.current.slice(0, visibleCountRef.current);
    setListings(nextListings);
    setHasMore(nextListings.length < allListingsRef.current.length);
    setLoadingMore(false);
  }, [loading, loadingMore, hasMore]);

  const refetch = useCallback(() => {
    void fetchListings();
  }, [fetchListings]);

  return { listings, loading, loadingMore, hasMore, error, loadMore, refetch };
}
