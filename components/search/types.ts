import type { Doc, Id } from "@/convex/_generated/dataModel";
import type { FileDoc } from "@/components/files/types";

export type SearchFilter =
  | "files"
  | "folders"
  | "emails"
  | "verified"
  | "people";

export type SearchFileHit = FileDoc & {
  matchIn: ("name" | "content")[];
  snippet?: string;
};

export type SearchFolderHit = Doc<"folders"> & { matchIn: "name"[] };

export type SearchEmailHit = Doc<"deliveries"> & {
  matchIn: ("subject" | "body" | "address")[];
  snippet?: string;
};

export type SearchPeopleHit = {
  email: string;
  documentId?: Id<"documents">;
  documentName?: string;
};

export type SearchResults = {
  files: SearchFileHit[];
  folders: SearchFolderHit[];
  emails: SearchEmailHit[];
  people: SearchPeopleHit[];
};
