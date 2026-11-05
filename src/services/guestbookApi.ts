export interface WishItem {
  id?: string | number;
  timestamp: string;
  name: string;
  message: string;
  relationship?: string;
}

export const GOOGLE_SCRIPT_API_URL =
  'https://script.google.com/macros/s/AKfycbzer-QcmOZjgFNBTn1kitUjcAX1DJRHUNhbASalUc3M1LXXgaHnk2X3pmlaHJ3P42LX1A/exec';

/**
 * Fetch all wishes from Google Sheet via doGet
 */
export async function getWishesFromGoogleSheet(): Promise<WishItem[]> {
  try {
    const res = await fetch(GOOGLE_SCRIPT_API_URL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();
    if (json && json.status === 'success' && Array.isArray(json.data)) {
      // Map data from sheet: { timestamp, name, message }
      return json.data.map((item: any, idx: number) => ({
        id: `sheet-${idx}-${item.timestamp || ''}`,
        timestamp: item.timestamp || 'Gần đây',
        name: item.name || 'Người chúc ẩn danh',
        message: item.message || '',
      })).reverse(); // Newest first
    }
    return [];
  } catch (err) {
    console.warn('Could not fetch from Google Sheet, falling back to local storage:', err);
    return [];
  }
}

/**
 * Submit a new wish to Google Sheet via doPost
 * We use mode: 'no-cors' to prevent CORS redirect blocks in browsers while ensuring Google Apps Script receives the payload.
 */
export async function postWishToGoogleSheet(name: string, message: string): Promise<boolean> {
  try {
    await fetch(GOOGLE_SCRIPT_API_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        name: name.trim(),
        message: message.trim(),
      }),
    });
    return true;
  } catch (err) {
    console.error('Failed to post wish to Google Sheet:', err);
    return false;
  }
}

