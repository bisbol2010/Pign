import { Doc } from "@/convex/_generated/dataModel";

/** A document row augmented with a resolved image preview URL (image files). */
export type FileDoc = Doc<"documents"> & { previewUrl: string | null };
