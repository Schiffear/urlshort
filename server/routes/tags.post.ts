import { tags } from "~/database/schema";
import { useDrizzle } from "~/utils/drizzle";

export default defineEventHandler(async event => {
    const db = useDrizzle()
    const body = await readBody(event)

    console.log(body)
  
    const results = await db.insert(tags).values({
        id: body.id,
        name: body.name,
        color: body.color
    })
    .returning()
  
    return { body }
  });
