import { eq } from "drizzle-orm";
import { links } from "~/database/schema";
import { useDrizzle } from "~/utils/drizzle";

// -- DELETE -- // with slug

export default defineEventHandler(async event => {
    const db = useDrizzle()
    const slug = getRouterParam(event, 'slug')

    const results = await db.delete(links).where(eq(links.slug, slug));
  
    return results
  })

  