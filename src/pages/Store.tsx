import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Avatar, Empty, Spin } from 'antd';
import { EnvironmentOutlined, SafetyCertificateFilled, ShopOutlined } from '@ant-design/icons';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { getStoreBySlug } from '@/hooks/useStore';
import { useStoreFollow } from '@/hooks/useStoreFollow';
import ListingCard from '@/components/ListingCard';
import type { ExternalListing, Listing, Store as StoreType } from '@/types';

export default function Store() {
  const { slug } = useParams();
  const [store, setStore] = useState<StoreType | null>(null);
  const [listings, setListings] = useState<(Listing | ExternalListing)[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    if (!slug) return undefined;
    void getStoreBySlug(slug).then(async (result) => {
      if (!active) return;
      setStore(result);
      if (!result) return;
      const snapshot = await getDocs(query(collection(db, 'listings'), where('storeId', '==', result.id), where('status', '==', 'active')));
      if (active) setListings(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Listing));
    }).catch(() => undefined).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [slug]);
  if (loading) return <div className="flex min-h-[50vh] items-center justify-center"><Spin size="large" /></div>;
  if (!store) return <Empty className="py-24" description="Mağaza tapılmadı" />;
  return <StoreContent store={store} listings={listings} />;
}

function StoreContent({ store, listings }: { store: StoreType; listings: (Listing | ExternalListing)[] }) {
  const { following, loading, toggle } = useStoreFollow(store.id);
  return <main className="min-h-screen bg-offwhite pb-20 dark:bg-background"><div className="h-44 bg-gradient-to-br from-action/90 via-action to-[#ff9b63]" /><div className="mx-auto -mt-14 max-w-7xl px-6"><div className="market-surface flex flex-col gap-5 p-6 md:flex-row md:items-end"><Avatar size={104} src={store.logoUrl} icon={<ShopOutlined />} className="border-4 border-paper bg-action text-4xl text-white dark:border-graphite" /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h1 className="font-display text-3xl font-bold text-ink dark:text-white">{store.name}</h1>{store.verified && <SafetyCertificateFilled className="text-action" />}</div><p className="mt-2 flex items-center gap-1 text-sm text-muted"><EnvironmentOutlined /> {store.city ?? 'Azərbaycan'} · {listings.length} aktiv elan</p></div><div className="flex gap-2"><button type="button" disabled={loading} onClick={() => void toggle()} className={`rounded-xl px-5 py-2.5 text-sm font-semibold ${following ? 'bg-action text-white' : 'bg-action/10 text-action'}`}>{following ? 'İzlənilir' : 'İzləyici ol'}</button><Link to="/elan-yerlesdir" className="market-action px-5 py-2.5">Elan yerləşdir</Link></div></div><div className="mt-8 max-w-3xl"><h2 className="font-display text-2xl font-bold text-ink dark:text-white">Mağaza haqqında</h2><p className="mt-3 whitespace-pre-line leading-7 text-muted">{store.description || 'Bu mağaza haqqında məlumat əlavə edilməyib.'}</p></div><div className="mt-10"><h2 className="font-display text-2xl font-bold text-ink dark:text-white">Mağazanın elanları</h2>{listings.length ? <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{listings.map((item) => <ListingCard key={item.id} listing={item} />)}</div> : <Empty className="py-16" description="Mağazada hələ aktiv elan yoxdur" />}</div></div></main>;
}
