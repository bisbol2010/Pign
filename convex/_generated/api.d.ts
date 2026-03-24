/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type { ApiFromModules, FilterApi, FunctionReference } from "convex/server";

import type * as ai from "../ai.js";
import type * as auth from "../auth.js";
import type * as documents from "../documents.js";
import type * as emails from "../emails.js";
import type * as http from "../http.js";
import type * as knowledge from "../knowledge.js";
import type * as shared from "../shared.js";
import type * as teams from "../teams.js";
import type * as trash from "../trash.js";
import type * as users from "../users.js";

declare const fullApi: ApiFromModules<{
  ai: typeof ai;
  auth: typeof auth;
  documents: typeof documents;
  emails: typeof emails;
  http: typeof http;
  knowledge: typeof knowledge;
  shared: typeof shared;
  teams: typeof teams;
  trash: typeof trash;
  users: typeof users;
}>;

export declare const api: FilterApi<typeof fullApi, FunctionReference<any, "public">>;
export declare const internal: FilterApi<typeof fullApi, FunctionReference<any, "internal">>;
