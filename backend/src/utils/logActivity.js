import { ActivityLog } from "../models/ActivityLog.js";

const sanitizeMetadata = (metadata = {}) =>
  Object.fromEntries(
    Object.entries(metadata).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );

export const logActivity = async ({
  userId,
  action,
  entityType,
  entityId,
  title,
  description,
  metadata,
}) => {
  if (!userId || !action || !entityType || !title) {
    return null;
  }

  try {
    return await ActivityLog.create({
      user: userId,
      action,
      entityType,
      entityId: entityId ? String(entityId) : undefined,
      title,
      description,
      metadata: sanitizeMetadata(metadata),
    });
  } catch (error) {
    return null;
  }
};
