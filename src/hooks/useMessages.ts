import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/firebase/config';
import type { ListingMessage } from '@/types';

export function messageMillis(message: Pick<ListingMessage, 'createdAt' | 'clientCreatedAt'>) {
  const value = message.createdAt;
  if (typeof value === 'number') return value;
  if (value && typeof (value as { toMillis?: () => number }).toMillis === 'function') return (value as { toMillis: () => number }).toMillis();
  return message.clientCreatedAt ?? 0;
}

export function useMessages(userId: string | undefined) {
  const [messages, setMessages] = useState<ListingMessage[]>([]);
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) { setMessages([]); setLoading(false); return undefined; }
    setLoading(true);
    const messageQuery = query(collection(db, 'tapar_message'), where('participants', 'array-contains', userId));
    return onSnapshot(messageQuery, (snapshot) => {
      const next = snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as ListingMessage));
      next.sort((a, b) => messageMillis(a) - messageMillis(b));
      setMessages(next);
      setLoading(false);
    }, () => {
      setError('Mesajları yükləmək mümkün olmadı.');
      setLoading(false);
    });
  }, [userId]);

  const unreadCount = messages.filter((item) => item.receiverId === userId && !item.readBy?.includes(userId)).length;
  return { messages, loading, error, unreadCount };
}
