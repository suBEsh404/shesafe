"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isExpoPushToken = isExpoPushToken;
exports.sendPushNotifications = sendPushNotifications;
const env_1 = require("../config/env");
function isExpoPushToken(token) {
    return /^Expo(nent)?PushToken\[[^\]]+\]$/.test(String(token || '').trim());
}
function uniqueTokens(tokens) {
    return [...new Set((tokens || []).map((item) => String(item || '').trim()).filter(Boolean))];
}
async function sendPushNotifications({ tokens, title, body, data = {}, priority = 'high' }) {
    const deduped = uniqueTokens(tokens);
    const validTokens = deduped.filter(isExpoPushToken);
    if (!env_1.expoPushEnabled) {
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
        const response = await fetch(env_1.expoPushApiUrl, {
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
        const invalidTokenSet = new Set();
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
    }
    catch (error) {
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
exports.default = {
    isExpoPushToken,
    sendPushNotifications
};
