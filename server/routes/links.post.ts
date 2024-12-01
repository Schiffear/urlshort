import { links } from "~/database/schema";
import { useDrizzle } from "~/utils/drizzle";

export default defineEventHandler(async event => {
    const db = useDrizzle()
    const body = await readBody(event)

    console.log(body)
  
    await db.insert(links).values({
        url: String(body.url),
        slug: String(body.slug),
        title: String(body.title),
        max_visits: body.max_visits,
        available_at: new Date(),
        expires_at: new Date(body.expired_at),
        created_at: new Date(),
        update_at: new Date(),
        tag_id: String(body.tags_id)
    })
    .returning()
  
    return { body }
  });
