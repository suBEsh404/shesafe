import asyncHandler from '../utils/asyncHandler';
import alertsService from '../services/alertsService';

const emergency = asyncHandler(async (req, res) => {
  const result = await alertsService.triggerEmergencyAlert({
    ownerUser: req.user,
    input: req.body
  });

  res.status(201).json({
    success: true,
    message: 'Emergency alert dispatched',
    data: result
  });
});

const liveLocation = asyncHandler(async (req, res) => {
  const result = await alertsService.sendLiveLocationAlert({
    ownerUser: req.user,
    input: req.body
  });

  res.status(201).json({
    success: true,
    message: 'Live location alert dispatched',
    data: result
  });
});

const registerPushToken = asyncHandler(async (req, res) => {
  const result = await alertsService.registerPushToken({
    user: req.user,
    input: req.body
  });

  res.status(200).json({
    success: true,
    message: 'Push token registered',
    data: result
  });
});

const removePushToken = asyncHandler(async (req, res) => {
  const result = await alertsService.removePushToken({
    user: req.user,
    input: req.body
  });

  res.status(200).json({
    success: true,
    message: 'Push token removed',
    data: result
  });
});

export {
  emergency,
  liveLocation,
  registerPushToken,
  removePushToken
};

export default {
  emergency,
  liveLocation,
  registerPushToken,
  removePushToken
};
