import type { MediaItem } from '@/types';

type ListingEmailData = {
  title: string;
  description: string;
  category?: string;
  city?: string | null;
  price?: number | null;
  ownerName?: string;
  ownerEmail?: string;
  media?: MediaItem[];
  link: string;
};

function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char] ?? char);
}

export function listingEmailCard(listing: ListingEmailData, intro: string): string {
  const media = (listing.media ?? []).filter((item) => item.type === 'image' && item.url).slice(0, 4);
  const gallery = media.length
    ? `<div style="display:flex;gap:8px;flex-wrap:wrap;margin:18px 0">${media.map((item) => `<img src="${escapeHtml(item.url)}" alt="${escapeHtml(listing.title)}" style="width:145px;height:105px;object-fit:cover;border-radius:8px;border:1px solid #e5e7eb" />`).join('')}</div>`
    : '';
  const price = listing.price == null ? 'Razılaşma yolu ilə' : `${escapeHtml(listing.price)} AZN`;
  return `<div style="margin:0 auto;max-width:620px;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;font-family:Arial,sans-serif;color:#111827"><div style="height:6px;background:#ff5a00"></div><div style="padding:28px"><p style="margin:0 0 14px;color:#ff5a00;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase">TAPAR.AZ · ELAN BİLDİRİŞİ</p><p style="font-size:16px;line-height:1.6;margin:0 0 18px">${escapeHtml(intro)}</p>${gallery}<h1 style="font-size:24px;line-height:1.25;margin:12px 0 8px;color:#111827">${escapeHtml(listing.title)}</h1><p style="font-size:22px;font-weight:700;color:#16a34a;margin:0 0 12px">${price}</p><p style="font-size:14px;color:#6b7280;margin:0 0 18px">${escapeHtml(listing.category)}${listing.city ? ` · ${escapeHtml(listing.city)}` : ''}</p><div style="background:#f9fafb;border-radius:10px;padding:14px;font-size:14px;line-height:1.6;white-space:pre-line">${escapeHtml(listing.description)}</div>${listing.ownerName ? `<p style="font-size:13px;color:#6b7280;margin:18px 0 0">Paylaşan: <strong>${escapeHtml(listing.ownerName)}</strong>${listing.ownerEmail ? ` · ${escapeHtml(listing.ownerEmail)}` : ''}</p>` : ''}<a href="${escapeHtml(listing.link)}" style="display:inline-block;margin-top:22px;background:#ff5a00;color:#fff;text-decoration:none;font-weight:700;border-radius:8px;padding:13px 20px">Elana bax / Admin panelə keç</a></div></div>`;
}
