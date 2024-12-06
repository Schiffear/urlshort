import { eq } from "drizzle-orm";
import { links } from "~/database/schema";
import { useDrizzle } from "~/utils/drizzle";

export default defineEventHandler(async (event) => {
  const db = useDrizzle();

  // Récupérer le slug depuis l'URL
  const slug = getRouterParam(event, "slug");

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: "Slug manquant dans la requête.",
    });
  }

  // Rechercher l'URL correspondant au slug
  const link = await db
    .select()
    .from(links)
    .where(eq(links.slug, slug))
    .then((res) => res[0]);

  // Vérifier si le lien existe
  if (!link) {
    throw createError({
      statusCode: 404,
      statusMessage: "Lien non trouvé pour le slug fourni.",
    });
  }

  // Rediriger vers l'URL originale
  return sendRedirect(event, link.url, 302); // Redirection temporaire (302)
});
