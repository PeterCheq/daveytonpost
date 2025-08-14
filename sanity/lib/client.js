import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";
import getPortUrl from "@/lib/getPortUrl";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  perspective: "previewDrafts",
  useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
  stega: {
    studioUrl: `${getPortUrl()}/studio`,
  },
});
