import { links } from "~/database/schema";
import { useDrizzle } from "~/utils/drizzle";


export default eventHandler(async (event) => {
    const db = useDrizzle()
  
    const results = await db.delete(links);
  
    return results
  });