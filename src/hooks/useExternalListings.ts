import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { DEMO_EXTERNAL_LISTINGS } from '@/data/externalListings';
import { db } from '@/firebase/config';
import type { ExternalListing } from '@/types';

export interface ExternalListingFilters {
  searchTerm?: string;
  category?: string;
  source?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
}

export function useExternalListings(filters: ExternalListingFilters = {}) {
  const [allListings, setAllListings] = useState<ExternalListing[]>(DEMO_EXTERNAL_LISTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void getDocs(collection(db, 'external_listings'))
      .then((snapshot) => {
        if (!active || snapshot.empty) return;
        setAllListings(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as ExternalListing));
      })
      .catch(() => undefined)
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const listings = useMemo(() => {
    const term = filters.searchTerm?.trim().toLocaleLowerCase('az-AZ');
    return allListings.filter((item) => {
      const haystack = `${item.title} ${item.description ?? ''} ${item.brand ?? ''} ${item.model ?? ''}`.toLocaleLowerCase('az-AZ');
      if (term && !haystack.includes(term)) return false;
      if (filters.category && item.category !== filters.category) return false;
      if (filters.source && item.source !== filters.source) return false;
      if (filters.city && item.city !== filters.city) return false;
      if (filters.minPrice !== undefined && (item.price === null || item.price < filters.minPrice)) return false;
      if (filters.maxPrice !== undefined && (item.price === null || item.price > filters.maxPrice)) return false;
      return true;
    });
  }, [allListings, filters.category, filters.city, filters.maxPrice, filters.minPrice, filters.searchTerm, filters.source]);

  return { listings, loading, error: null as string | null };
}

export function externalListingLabel(item: ExternalListing) {
  if (item.category === 'real_estate') return 'Daşınmaz əmlak';
  if (item.category === 'automobile') return 'Avtomobil';
  if (item.category === 'electronics') return 'Elektronika';
  return item.category;
}
