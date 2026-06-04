/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ai from "../ai.js";
import type * as auth from "../auth.js";
import type * as billing from "../billing.js";
import type * as deliveries from "../deliveries.js";
import type * as documents from "../documents.js";
import type * as duplicates from "../duplicates.js";
import type * as emails from "../emails.js";
import type * as folders from "../folders.js";
import type * as http from "../http.js";
import type * as knowledge from "../knowledge.js";
import type * as notifications from "../notifications.js";
import type * as plans from "../plans.js";
import type * as search from "../search.js";
import type * as shareLinks from "../shareLinks.js";
import type * as shared from "../shared.js";
import type * as subscriptions from "../subscriptions.js";
import type * as teams from "../teams.js";
import type * as trash from "../trash.js";
import type * as users from "../users.js";
import type * as verification from "../verification.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  ai: typeof ai;
  auth: typeof auth;
  billing: typeof billing;
  deliveries: typeof deliveries;
  documents: typeof documents;
  duplicates: typeof duplicates;
  emails: typeof emails;
  folders: typeof folders;
  http: typeof http;
  knowledge: typeof knowledge;
  notifications: typeof notifications;
  plans: typeof plans;
  search: typeof search;
  shareLinks: typeof shareLinks;
  shared: typeof shared;
  subscriptions: typeof subscriptions;
  teams: typeof teams;
  trash: typeof trash;
  users: typeof users;
  verification: typeof verification;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
