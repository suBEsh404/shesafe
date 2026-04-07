import { expoPushApiUrl, expoPushEnabled } from '../config/env';

function isExpoPushToken(token: string) {
  return /^Expo(nent)?PushToken\[[^\]]+\]$/.test(String(token || '').trim());
}

function uniqueTokens(tokens: string[]) {
  return [...new Set((tokens || []).map((item) => String(item || '').trim()).filter(Boolean))];
}

async function sendPushNotifications({
  tokens,
  title,
  body,
  data = {},
  priority = 'high'
}: {
  tokens: string[];
  title: string;
  body: string;
  data?: Record<string, any>;
  priority?: 'default' | 'normal' | 'high';
}) {
  const deduped = uniqueTokens(tokens);
  const validTokens = deduped.filter(isExpoPushToken);

  if (!expoPushEnabled) {
    return {
      enabled: false,
      requestedCount: deduped.length,
      acceptedCount: 0,
      failedCount: 0,
      invalidTokens: [],
      provider: 'expo',
      message: 'Push notifications are disabled by configuration'
    };
  }

  if (!validTokens.length) {
    return {
      enabled: true,
      requestedCount: deduped.length,
      acceptedCount: 0,
      failedCount: 0,
      invalidTokens: deduped,
      provider: 'expo',
      message: 'No valid Expo push tokens provided'
    };
  }

  const payload = validTokens.map((to) => ({
    to,
    title,
    body,
    data,
    sound: 'default',
    priority
  }));

  try {
    const response = await fetch(expoPushApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      return {
        enabled: true,
        requestedCount: deduped.length,
        acceptedCount: 0,
        failedCount: validTokens.length,
        invalidTokens: [],
        provider: 'expo',
        message: `Expo push API returned status ${response.status}`
      };
    }

    const result = await response.json();
    const responseItems = Array.isArray(result?.data) ? result.data : [];
    const acceptedCount = responseItems.filter((item) => item?.status === 'ok').length;

    const invalidTokenSet = new Set<string>();
    responseItems.forEach((item, index) => {
      if (item?.status === 'error' && item?.details?.error === 'DeviceNotRegistered') {
        const token = validTokens[index];
        if (token) {
          invalidTokenSet.add(token);
        }
      }
    });

    return {
      enabled: true,
      requestedCount: deduped.length,
      acceptedCount,
      failedCount: validTokens.length - acceptedCount,
      invalidTokens: [...invalidTokenSet],
      provider: 'expo',
      message: 'Push dispatch attempted'
    };
  } catch (error: any) {
    return {
      enabled: true,
      requestedCount: deduped.length,
      acceptedCount: 0,
      failedCount: validTokens.length,
      invalidTokens: [],
      provider: 'expo',
      message: error?.message || 'Push dispatch failed'
    };
  }
}

export {
  isExpoPushToken,
  sendPushNotifications
};

export default {
  isExpoPushToken,
  sendPushNotifications
};
