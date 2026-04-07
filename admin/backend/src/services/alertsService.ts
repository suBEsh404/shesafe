import EmergencyAlert from '../models/EmergencyAlert';
import TrustedContact from '../models/TrustedContact';
import User from '../models/User';
import { isExpoPushToken, sendPushNotifications } from './notificationService';
import ApiError from '../utils/ApiError';

function mapAlert(alert) {
  return {
    id: alert._id,
    alertType: alert.alertType,
    sessionId: alert.sessionId || null,
    status: alert.status,
    message: alert.message || null,
    location: alert.location || {},
    notifiedContacts: alert.notifiedContacts || [],
    metadata: alert.metadata || {},
    createdAt: alert.createdAt
  };
}

function toObjectIdString(value) {
  if (!value) {
    return '';
  }

  return String(value?._id || value);
}

function uniqueStrings(values) {
  return [...new Set((values || []).map((item) => String(item || '').trim()).filter(Boolean))];
}

function collectUserTokens(users): string[] {
  const allTokens = (users || []).flatMap((user) =>
    (user?.expoPushTokens || []).map((entry) => String(entry?.token || '').trim()).filter(Boolean)
  );

  return uniqueStrings(allTokens).filter(isExpoPushToken) as string[];
}

async function pruneInvalidTokens(tokens) {
  const invalidTokens = uniqueStrings(tokens);
  if (!invalidTokens.length) {
    return;
  }

  await User.updateMany(
    {
      'expoPushTokens.token': { $in: invalidTokens }
    },
    {
      $pull: {
        expoPushTokens: { token: { $in: invalidTokens } }
      }
    }
  );
}

async function resolveRecipients({ ownerUserId, contacts }): Promise<{
  contactUsers: any[];
  authorityUsers: any[];
  contactTokens: string[];
  authorityTokens: string[];
}> {
  const contactEmails = uniqueStrings(
    (contacts || []).map((contact) => String(contact?.email || '').toLowerCase()).filter(Boolean)
  );

  const [contactUsers, authorityUsers] = await Promise.all([
    contactEmails.length
      ? User.find({ email: { $in: contactEmails }, status: 'active' })
          .select('_id name email expoPushTokens')
          .lean()
      : Promise.resolve([]),
    User.find({ role: 'authority', status: 'active', _id: { $ne: ownerUserId } })
      .select('_id name email expoPushTokens')
      .lean()
  ]);

  return {
    contactUsers,
    authorityUsers,
    contactTokens: collectUserTokens(contactUsers),
    authorityTokens: collectUserTokens(authorityUsers)
  };
}

async function triggerEmergencyAlert({ ownerUser, input }) {
  const ownerUserId = toObjectIdString(ownerUser);
  if (!ownerUserId) {
    throw new ApiError(401, 'Authentication required');
  }

  const contacts = await TrustedContact.find({
    ownerUserId,
    isSharing: true
  })
    .sort({ emergencyPriority: 1, createdAt: -1 })
    .lean();

  const recipients = await resolveRecipients({ ownerUserId, contacts });

  const contactPushResult = await sendPushNotifications({
    tokens: recipients.contactTokens,
    title: 'Emergency Alert',
    body: `${ownerUser?.name || 'A trusted contact'} triggered an emergency alert.`,
    data: {
      event: 'emergency_alert',
      ownerUserId,
      sessionId: input.sessionId || null,
      location: input.location || null
    },
    priority: 'high'
  });

  const authorityPushResult = await sendPushNotifications({
    tokens: recipients.authorityTokens,
    title: 'Emergency Alert Reported',
    body: `${ownerUser?.name || 'User'} triggered panic mode and requested help.`,
    data: {
      event: 'authority_emergency_alert',
      ownerUserId,
      sessionId: input.sessionId || null,
      location: input.location || null
    },
    priority: 'high'
  });

  await pruneInvalidTokens([
    ...(contactPushResult.invalidTokens || []),
    ...(authorityPushResult.invalidTokens || [])
  ]);

  const alert = await EmergencyAlert.create({
    ownerUserId,
    alertType: 'emergency',
    sessionId: input.sessionId || null,
    message: input.message || 'Emergency alert triggered from mobile app',
    status: 'sent',
    location: input.location || {},
    notifiedContacts: contacts.map((contact) => contact._id),
    metadata: {
      ...input.metadata,
      notifiedCount: contacts.length,
      dispatchMode: 'mobile-trigger',
      push: {
        contacts: contactPushResult,
        authorities: authorityPushResult
      }
    }
  });

  return {
    ...mapAlert(alert),
    notifiedCount: contacts.length,
    pushDispatch: {
      contacts: contactPushResult,
      authorities: authorityPushResult
    },
    contacts: contacts.map((contact) => ({
      id: contact._id,
      name: contact.name,
      relationship: contact.relationship,
      phone: contact.phone,
      email: contact.email
    }))
  };
}

async function sendLiveLocationAlert({ ownerUser, input }) {
  const ownerUserId = toObjectIdString(ownerUser);
  if (!ownerUserId) {
    throw new ApiError(401, 'Authentication required');
  }

  const contacts = await TrustedContact.find({
    ownerUserId,
    isSharing: true
  })
    .sort({ emergencyPriority: 1, createdAt: -1 })
    .lean();

  const recipients = await resolveRecipients({ ownerUserId, contacts });

  const contactPushResult = await sendPushNotifications({
    tokens: recipients.contactTokens,
    title: 'Live Location Update',
    body: `${ownerUser?.name || 'A trusted contact'} shared a live location update.`,
    data: {
      event: 'live_location_alert',
      ownerUserId,
      sessionId: input.sessionId,
      location: input.location
    },
    priority: 'normal'
  });

  await pruneInvalidTokens(contactPushResult.invalidTokens || []);

  const alert = await EmergencyAlert.create({
    ownerUserId,
    alertType: 'live-location',
    sessionId: input.sessionId,
    message: 'Live location update',
    status: 'sent',
    location: input.location,
    notifiedContacts: contacts.map((contact) => contact._id),
    metadata: {
      ...input.metadata,
      notifiedCount: contacts.length,
      dispatchMode: 'travel-monitoring',
      push: {
        contacts: contactPushResult
      }
    }
  });

  return {
    ...mapAlert(alert),
    notifiedCount: contacts.length,
    pushDispatch: {
      contacts: contactPushResult
    }
  };
}

async function registerPushToken({ user, input }) {
  const userId = toObjectIdString(user);
  if (!userId) {
    throw new ApiError(401, 'Authentication required');
  }

  const token = String(input?.token || '').trim();
  if (!isExpoPushToken(token)) {
    throw new ApiError(400, 'Invalid Expo push token format');
  }

  const dbUser = await User.findById(userId).select('expoPushTokens').lean();
  if (!dbUser) {
    throw new ApiError(404, 'User not found');
  }

  const existing = Array.isArray((dbUser as any).expoPushTokens) ? (dbUser as any).expoPushTokens : [];
  const filtered = existing.filter((item) => String(item?.token || '').trim() !== token);
  const nextTokens = [
    ...filtered,
    {
      token,
      deviceId: input?.deviceId || null,
      platform: input?.platform || 'unknown',
      lastRegisteredAt: new Date()
    }
  ];

  await User.updateOne(
    { _id: userId },
    {
      $set: {
        expoPushTokens: nextTokens
      }
    }
  );

  return {
    token,
    totalTokens: nextTokens.length
  };
}

async function removePushToken({ user, input }) {
  const userId = toObjectIdString(user);
  if (!userId) {
    throw new ApiError(401, 'Authentication required');
  }

  const token = String(input?.token || '').trim();
  if (!token) {
    throw new ApiError(400, 'Token is required');
  }

  const dbUser = await User.findById(userId).select('expoPushTokens').lean();
  if (!dbUser) {
    throw new ApiError(404, 'User not found');
  }

  const existing = Array.isArray((dbUser as any).expoPushTokens) ? (dbUser as any).expoPushTokens : [];
  const nextTokens = existing.filter((item) => String(item?.token || '').trim() !== token);

  await User.updateOne(
    { _id: userId },
    {
      $set: {
        expoPushTokens: nextTokens
      }
    }
  );

  return {
    token,
    totalTokens: nextTokens.length
  };
}

export {
  triggerEmergencyAlert,
  sendLiveLocationAlert,
  registerPushToken,
  removePushToken
};

export default {
  triggerEmergencyAlert,
  sendLiveLocationAlert,
  registerPushToken,
  removePushToken
};
