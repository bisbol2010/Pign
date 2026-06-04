import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);


export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const user = await ctx.db.get(userId);
    if (!user) return null;

    let avatarUrl: string | null = null;
    if (user.avatarStorageId) {
      avatarUrl = await ctx.storage.getUrl(user.avatarStorageId);
    } else if (user.image) {
      avatarUrl = user.image;
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      pignHandle: user.pignHandle,
      avatarUrl,
      timezone: user.timezone,
      timezoneAuto: user.timezoneAuto,
      dateFormat: user.dateFormat,
      language: user.language,
    };
  },
});

export const updateName = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const trimmed = args.name.trim();
    if (!trimmed) throw new Error("Name cannot be empty");
    await ctx.db.patch(userId, { name: trimmed });
  },
});

export const generateAvatarUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.storage.generateUploadUrl();
  },
});

export const updateAvatar = mutation({
  args: {
    storageId: v.id("_storage"),
    contentType: v.string(),
    size: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    if (!ALLOWED_AVATAR_TYPES.has(args.contentType)) {
      throw new Error("Unsupported image type");
    }
    if (args.size > MAX_AVATAR_BYTES) {
      throw new Error("Image must be 2 MB or smaller");
    }

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    if (user.avatarStorageId && user.avatarStorageId !== args.storageId) {
      await ctx.storage.delete(user.avatarStorageId);
    }

    await ctx.db.patch(userId, { avatarStorageId: args.storageId });
  },
});

export const removeAvatar = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");
    if (user.avatarStorageId) {
      await ctx.storage.delete(user.avatarStorageId);
    }
    await ctx.db.patch(userId, { avatarStorageId: undefined });
  },
});

export const updateTimezone = mutation({
  args: {
    timezone: v.string(),
    timezoneAuto: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const timezone = args.timezone.trim();
    if (!timezone) throw new Error("Timezone is required");
    await ctx.db.patch(userId, {
      timezone,
      timezoneAuto: args.timezoneAuto,
    });
  },
});

export const updatePreferences = mutation({
  args: {
    language: v.optional(v.string()),
    dateFormat: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const patch: { language?: string; dateFormat?: string } = {};
    if (args.language !== undefined) {
      const language = args.language.trim();
      if (!language) throw new Error("Language is required");
      patch.language = language;
    }
    if (args.dateFormat !== undefined) {
      const dateFormat = args.dateFormat.trim();
      if (!dateFormat) throw new Error("Date format is required");
      patch.dateFormat = dateFormat;
    }
    if (Object.keys(patch).length === 0) return;
    await ctx.db.patch(userId, patch);
  },
});
