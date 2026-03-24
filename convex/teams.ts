import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("teams")
      .withIndex("by_admin", (q) => q.eq("adminId", userId))
      .collect();
  },
});

export const create = mutation({
  args: { name: v.string(), memberEmails: v.array(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.db.insert("teams", {
      adminId: userId,
      name: args.name,
      memberEmails: args.memberEmails,
    });
  },
});

export const addMember = mutation({
  args: { teamId: v.id("teams"), email: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const team = await ctx.db.get(args.teamId);
    if (!team || team.adminId !== userId) throw new Error("Not found");
    if (team.memberEmails.includes(args.email)) return;
    await ctx.db.patch(args.teamId, {
      memberEmails: [...team.memberEmails, args.email],
    });
  },
});

export const removeMember = mutation({
  args: { teamId: v.id("teams"), email: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const team = await ctx.db.get(args.teamId);
    if (!team || team.adminId !== userId) throw new Error("Not found");
    await ctx.db.patch(args.teamId, {
      memberEmails: team.memberEmails.filter((e) => e !== args.email),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("teams") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const team = await ctx.db.get(args.id);
    if (!team || team.adminId !== userId) throw new Error("Not found");
    await ctx.db.delete(args.id);
  },
});
