import { eq } from "drizzle-orm";
import { links } from "~/database/schema";
import { useDrizzle } from "~/utils/drizzle";

export default defineEventHandler(async event => {
    const db = useDrizzle()
    const body = await readBody(event)
    const slug = getRouterParam(event, 'slug')

    console.log(body)
  
    await db.update(links)
        .set({ title: body.title, update_at: new Date() })
        .where(eq(links.slug, slug))
        .returning({ updatedId: links.slug });

  
    return { body }
  });
