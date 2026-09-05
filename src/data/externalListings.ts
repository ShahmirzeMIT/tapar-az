import type { ExternalListing } from '@/types';

const image = (url: string) => url.replace(/\\_/g, '_');

/** Demo records mirror the production scraper payload and can be replaced by API data. */
export const DEMO_EXTERNAL_LISTINGS: ExternalListing[] = [
  {
    id: 'bina.az_6435950', source: 'bina.az', source_id: '6435950',
    title: '3 otaqlı mənzil, 125 m², Badamdar q.', description: null,
    category: 'real_estate', subcategory: null, listing_type: 'sell', price: 280000, currency: 'AZN',
    city: 'Bakı', district: 'Badamdar q.', settlement: null, address: null, latitude: null, longitude: null,
    rooms: 3, area: 125, floor: 12, total_floors: 13, brand: null, model: null, year: null, mileage: null,
    images: [image('https://bina.azstatic.com/uploads/f660x496/2026%2F09%2F05%2F15%2F13%2F39%2F1300a70e-b223-409e-931b-503279791812%2F50448_haZjU24ML86NPB7r8rqClg.jpg')],
    seller_name: 'Emin', seller_type: 'AGENCY', original_url: 'https://bina.az/items/6435950', published_at: '2026-09-05T15:16:07+04:00',
  },
  {
    id: 'tap.az_45033260', source: 'tap.az', source_id: '45033260', title: 'Uşaq velosipedi',
    description: '12 Dyumluq uşaq velosipedi – kiçik şahzadələr üçün ideal seçim!', category: 'electronics', subcategory: 'velosipedlər', listing_type: 'sell', price: 79, currency: 'AZN',
    city: 'Bakı', district: null, settlement: null, address: null, latitude: null, longitude: null,
    rooms: null, area: null, floor: null, total_floors: null, brand: null, model: null, year: null, mileage: null,
    images: [image('https://tap.azstatic.com/uploads/full/2025%2F06%2F25%2F08%2F15%2F35%2Fcfd10700-3b5c-4044-a783-c4a298d81623%2F66008_-f1hpkebL9FYqnHCOa3oWQ.jpg')],
    seller_name: null, seller_type: null, original_url: 'https://tap.az/elanlar/hobbi-ve-asude/velosipedler/45033260', published_at: null,
  },
  {
    id: 'turbo.az_10584525', source: 'turbo.az', source_id: '10584525-changan-cs-55-plus', title: 'Changan CS 55 Plus', description: null,
    category: 'automobile', subcategory: null, listing_type: 'sell', price: 33300, currency: 'AZN', city: 'Bakı', district: null, settlement: null, address: null, latitude: null, longitude: null,
    rooms: null, area: null, floor: null, total_floors: null, brand: 'Changan', model: 'CS 55 Plus', year: 2026, mileage: 0,
    images: [image('https://turbo.azstatic.com/uploads/f660x496/2026%2F07%2F29%2F23%2F33%2F46%2F4c3ce265-bbd6-40f9-999a-c5de056cbc8e%2F64525_6TxchIex8l2M_7ZdAFe6sA.jpg')],
    seller_name: null, seller_type: null, original_url: 'https://turbo.az/autos/10584525-changan-cs-55-plus', published_at: null,
  },
  {
    id: 'birmarket.az_1472950', source: 'birmarket.az', source_id: '1472950', title: 'Smartfon Apple iPhone 17 Pro 256GB Cosmic Orange', description: null,
    category: 'electronics', subcategory: null, listing_type: 'sell', price: 2869.99, currency: 'AZN', city: 'Bakı', district: null, settlement: null, address: null, latitude: null, longitude: null,
    rooms: null, area: null, floor: null, total_floors: null, brand: 'Apple', model: 'iPhone 17 Pro', year: null, mileage: null,
    images: [image('https://strgimgr.b-cdn.net/img/product/280/e029700d-3b75-40e7-a1eb-74998ef29077.jpeg?width=280&height=280')],
    seller_name: null, seller_type: null, original_url: 'https://birmarket.az/product/1472950-smartfon-apple-iphone-17-pro-256gb-cosmic-orange-mg7l4ll-a', published_at: null,
  },
];
