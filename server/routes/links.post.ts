import { links } from "~/database/schema";
import { useDrizzle } from "~/utils/drizzle";
import { nanoid } from "nanoid"; // Génère un slug unique.
import { link_tags } from "~/database/schema";
import { requireUser } from "~/utils/auth";

export default defineEventHandler(async (event) => {
  const user = requireUser(event)
  console.log(user)
  const db = useDrizzle();
  const body = await readBody(event);

  // Vérifier si le corps de la requête contient une URL
  if (!body || !body.url) {
    throw createError({
      statusCode: 400,
      statusMessage: "Le corps de la requête doit contenir une clé 'url'.",
    });
  }

  // Générer un slug unique
  const slug = nanoid(8);

  // Insérer l'URL dans la base de données
  const newLink = await db
    .insert(links)
    .values({
      url: String(body.url),
      slug: slug,
      title: body.title || null, 
      max_visits: body.max_visits || null,
      available_at: new Date(body.available_at || Date.now()),
      expired_at: body.expired_at ? new Date(body.expired_at) : null,
      created_at: new Date(),
      update_at: new Date(),
    })
    .returning()
    .then((res) => res[0]); // Récupérer l'élément inséré.

  // Retourner l'URL raccourcie
  return {
    statusCode: 201,
    body: {
      message: "URL raccourcie créée avec succès.",
      shortLink: `http://localhost:3000/links/${newLink.slug}`, // Le lien court généré
      link: newLink,
    },
  };
});
