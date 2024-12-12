import { eq } from "drizzle-orm";
import { tags } from "~/database/schema";
import { useDrizzle } from "~/utils/drizzle";

// -- DELETE -- // avec id

export default defineEventHandler(async event => {
    const db = useDrizzle();
    
    const id = getRouterParam(event, 'id');

    const results = await db.delete(tags).where(eq(tags.id, id));
  
    return results
  })
  

