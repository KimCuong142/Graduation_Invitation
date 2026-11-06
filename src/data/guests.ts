export interface GuestProfile {
  slug: string;
  aliases?: string[];
  name: string;
  salutation: string;
  role: string;
  customGreeting?: string;
}

export const PREDEFINED_GUESTS: GuestProfile[] = [
  {
    slug: 'phuong-an',
    aliases: ['nguyen-tran-phuong-an', 'phuongan', 'an'],
    name: 'Nguyễn Trần Phương An',
    salutation: 'Thân gửi',
    role: 'Bạn thân / Đồng môn',
    customGreeting: 'Cảm ơn Phương An đã luôn là người bạn đồng hành tuyệt vời trong suốt những năm tháng thanh xuân đại học!'
  },
  {
    slug: 'thao-nguyen',
    aliases: ['nguyen-ngoc-thao', 'ngocthao', 'thao'],
    name: 'Nguyễn Ngọc Thảo',
    salutation: 'Thân gửi',
    role: 'Bạn bè',
    customGreeting: 'Rất vui và trân quý khi được đón tiếp Ngọc Thảo tại ngày lễ tốt nghiệp này!'
  },
  {
    slug: 'bao-chau',
    aliases: ['le-bao-chau', 'baochau', 'chau'],
    name: 'Lê Bảo Châu',
    salutation: 'Thân gửi',
    role: 'Bạn bè',
    customGreeting: 'Sự hiện diện của Bảo Châu là niềm vinh hạnh và kỷ niệm vô giá đối với Kim Cương!'
  },
  {
    slug: 'dang-khoa',
    aliases: ['le-minh-dang-khoa', 'dangkhoa', 'khoa'],
    name: 'Lê Minh Đăng Khoa',
    salutation: 'Thân gửi',
    role: 'Bạn bè / Đồng môn',
    customGreeting: 'Chào Đăng Khoa! Rất mong được gặp bạn để cùng lưu giữ những khoảnh khắc đáng nhớ nhất!'
  }
];

// Helper to remove Vietnamese tones and convert to slug format for comparison
export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Resolves current guest from URL:
 * Supports:
 * - Query param: ?to=phuong-an OR ?to=Nguyễn+Trần+Phương+An
 * - Path: /to/phuong-an OR /phuong-an
 * - Hash: #/to/phuong-an
 */
export function resolveGuestFromUrl(): GuestProfile | null {
  if (typeof window === 'undefined') return null;

  let rawIdentifier = '';

  // 1. Check query parameter `to`, `guest`, `name`
  const params = new URLSearchParams(window.location.search);
  const queryGuest = params.get('to') || params.get('guest') || params.get('name');
  if (queryGuest) {
    rawIdentifier = decodeURIComponent(queryGuest).trim();
  }

  // 2. Check path parameter: /to/:slug or /:slug
  if (!rawIdentifier) {
    const pathname = window.location.pathname.replace(/^\/|\/$/g, '');
    if (pathname) {
      if (pathname.startsWith('to/')) {
        rawIdentifier = decodeURIComponent(pathname.slice(3)).trim();
      } else {
        // Direct path e.g. /phuong-an or /le-bao-chau
        rawIdentifier = decodeURIComponent(pathname).trim();
      }
    }
  }

  // 3. Check hash parameter e.g. #/to/:slug
  if (!rawIdentifier && window.location.hash) {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (hash.startsWith('to/')) {
      rawIdentifier = decodeURIComponent(hash.slice(3)).trim();
    }
  }

  if (!rawIdentifier) return null;

  const inputSlug = toSlug(rawIdentifier);

  // Look up in predefined guests
  const matched = PREDEFINED_GUESTS.find(g => {
    return (
      g.slug === inputSlug ||
      toSlug(g.name) === inputSlug ||
      (g.aliases && g.aliases.some(alias => toSlug(alias) === inputSlug))
    );
  });

  if (matched) {
    return matched;
  }

  // Fallback: If not found in predefined list, humanize the raw input so any custom name works
  // e.g. "Nguyen-Van-A" -> "Nguyen Van A"
  const humanizedName = rawIdentifier
    .replace(/[-_+]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return {
    slug: inputSlug,
    name: humanizedName,
    salutation: 'Trân trọng kính mời',
    role: 'Khách quý',
    customGreeting: 'Sự hiện diện của bạn là niềm vinh hạnh lớn đối với Kim Cương!'
  };
}

export type GuestPanelKey = 'An' | 'Châu' | 'Khoa' | 'Thảo';

export function getGuestPanelKey(guest?: GuestProfile | null): GuestPanelKey {
  if (!guest) return 'An';
  const slug = toSlug(guest.slug || guest.name || '');
  if (slug.includes('chau')) return 'Châu';
  if (slug.includes('khoa')) return 'Khoa';
  if (slug.includes('thao')) return 'Thảo';
  return 'An';
}

