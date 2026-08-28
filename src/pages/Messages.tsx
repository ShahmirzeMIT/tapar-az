import { useEffect, useMemo, useState } from 'react';
import { addDoc, arrayUnion, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { Alert, Avatar, Button, Empty, Input, Skeleton } from 'antd';
import { ArrowLeftOutlined, MessageOutlined, SendOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { db } from '@/firebase/config';
import { useAuth } from '@/context/AuthContext';
import { useListing } from '@/hooks/useListing';
import { formatFullDateTime } from '@/utils/format';
import type { ListingMessage } from '@/types';
import { messageMillis, useMessages } from '@/hooks/useMessages';

const { TextArea } = Input;

export default function Messages() {
  const { listingId } = useParams<{ listingId?: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { listing, loading: listingLoading } = useListing(listingId);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const { messages, loading, error, unreadCount } = useMessages(user?.uid);

  const conversation = useMemo(
    () => listingId ? messages.filter((item) => item.listingId === listingId) : messages,
    [listingId, messages],
  );
  const otherParticipant = conversation.find((item) => item.senderId !== user?.uid);
  const recipientId = otherParticipant?.senderId ?? (listing?.ownerId !== user?.uid ? listing?.ownerId : undefined);
  const recipientName = listing?.ownerName ?? otherParticipant?.senderName ?? 'İstifadəçi';

  const sendMessage = async () => {
    const cleanText = text.trim();
    if (!user || !listingId || !recipientId || !cleanText) return;
    if (recipientId === user.uid) { setSendError('Öz elanınıza mesaj göndərə bilməzsiniz.'); return; }
    setSending(true);
    setSendError(null);
    try {
      await addDoc(collection(db, 'tapar_message'), {
        listingId,
        listingTitle: listing?.title ?? otherParticipant?.listingTitle ?? 'Elan',
        senderId: user.uid,
        senderName: profile?.displayName ?? user.displayName ?? 'İstifadəçi',
        receiverId: recipientId,
        participants: [user.uid, recipientId],
        text: cleanText,
        createdAt: serverTimestamp(),
        clientCreatedAt: Date.now(),
        readBy: [user.uid],
      });
      setText('');
    } catch {
      setSendError('Mesaj göndərilmədi. Yenidən cəhd edin.');
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (!user || !listingId) return;
    const unread = conversation.filter((item) => item.receiverId === user.uid && !item.readBy?.includes(user.uid));
    if (unread.length > 0) {
      void Promise.all(unread.map((item) => updateDoc(doc(db, 'tapar_message', item.id), { readBy: arrayUnion(user.uid) })));
    }
  }, [conversation, listingId, user]);

  if (!listingId) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10">
        <p className="market-section-label mb-2">Əlaqə mərkəzi</p>
        <div className="flex items-center gap-3">
          <h1 className="font-display text-3xl font-bold text-ink dark:text-white">Mesajlar</h1>
          {unreadCount > 0 && <span className="rounded-full bg-urgent px-2.5 py-1 text-xs font-bold text-white">{unreadCount} yeni</span>}
        </div>
        <div className="market-surface mt-6 p-6">
          {loading ? <Skeleton active /> : messages.length === 0 ? <Empty description="Hələ mesajınız yoxdur" /> : (
            <div className="divide-y divide-line dark:divide-line-dark">
              {conversationByListing(messages, user?.uid).map((item) => (
                <button key={item.listingId} onClick={() => navigate(`/mesajlar/${item.listingId}`)} className="flex w-full items-center gap-3 py-4 text-left hover:bg-offwhite dark:hover:bg-graphite px-2 transition-colors">
                  <Avatar icon={<MessageOutlined />} className="bg-action" />
                  <span className="min-w-0 flex-1"><strong className="block truncate text-ink dark:text-white">{item.listingTitle}</strong><small className="text-muted">{item.senderName} · {formatFullDateTime(item.createdAt ?? item.clientCreatedAt)}</small></span>
                  {item.unread > 0 && <span className="rounded-full bg-action px-2 py-0.5 text-xs font-bold text-white">{item.unread} yeni</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 pb-28">
      <Link to={`/elanlar/${listingId}`} className="inline-flex items-center gap-2 text-sm text-muted hover:text-action mb-5"><ArrowLeftOutlined /> Elana qayıt</Link>
      <div className="market-surface overflow-hidden">
        <div className="border-b border-line dark:border-line-dark p-5 flex items-center gap-3">
          <Avatar icon={<UserOutlined />} className="bg-action" />
          <div className="min-w-0"><p className="font-semibold text-ink dark:text-white">{recipientName}</p><p className="text-xs text-muted truncate">{listing?.title ?? 'Elan üzrə yazışma'}</p></div>
        </div>
        {(error || sendError) && <Alert type="error" showIcon message={error ?? sendError} className="m-4" />}
        <div className="min-h-[360px] max-h-[520px] overflow-y-auto bg-offwhite/50 dark:bg-background p-5 space-y-3">
          {listingLoading || loading ? <Skeleton active /> : conversation.length === 0 ? <Empty description="İlk mesajı siz yazın" className="py-24" /> : conversation.map((item) => {
            const mine = item.senderId === user?.uid;
            return <div key={item.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[80%] rounded-xl px-4 py-3 ${mine ? 'bg-action text-white' : 'bg-paper dark:bg-graphite text-ink dark:text-white border border-line dark:border-line-dark'}`}><p className="text-sm whitespace-pre-wrap">{item.text}</p><time className={`mt-1 block text-[10px] ${mine ? 'text-white/75' : 'text-muted'}`}>{formatFullDateTime(item.createdAt ?? item.clientCreatedAt)}</time></div></div>;
          })}
        </div>
        <div className="border-t border-line dark:border-line-dark p-4 flex gap-2">
          <TextArea value={text} onChange={(event) => setText(event.target.value)} onPressEnter={(event) => { if (!event.shiftKey) { event.preventDefault(); void sendMessage(); } }} autoSize={{ minRows: 1, maxRows: 4 }} placeholder="Mesajınızı yazın..." />
          <Button type="primary" icon={<SendOutlined />} loading={sending} disabled={!text.trim() || !recipientId} onClick={() => void sendMessage}>Göndər</Button>
        </div>
      </div>
    </div>
  );
}

function conversationByListing(items: ListingMessage[], userId?: string) {
  const latest = new Map<string, ListingMessage & { unread: number }>();
  items.forEach((item) => {
    const previous = latest.get(item.listingId);
    const unread = (previous?.unread ?? 0) + (item.receiverId === userId && !item.readBy?.includes(userId ?? '') ? 1 : 0);
    if (!previous || messageMillis(item) >= messageMillis(previous)) latest.set(item.listingId, { ...item, unread });
    else if (previous) latest.set(item.listingId, { ...previous, unread });
  });
  return Array.from(latest.values()).sort((a, b) => messageMillis(b) - messageMillis(a));
}
