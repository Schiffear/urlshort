import { eq } from "drizzle-orm";               // Importe l'opérateur "eq" pour les comparaisons SQL avec Drizzle ORM
import { links } from "~/database/schema";      // Importe la table "links" définie dans le schéma Drizzle ORM
import { useDrizzle } from "~/utils/drizzle";   // Utilise une fonction personnalisée pour initialiser Drizzle ORM

export default defineEventHandler(async (event) => {
  const db = useDrizzle(); // Initialise l'instance Drizzle ORM pour interagir avec la base de données

  // Récupérer le paramètre dynamique "slug" depuis l'URL
  const slug = getRouterParam(event, "slug");

  // Vérification si le slug est manquant dans la requête
  if (!slug) {
    throw createError({
      statusCode: 400,                 // Erreur 400 : Mauvaise requête
      statusMessage: "Slug manquant dans la requête.",
    });
  }

  // Recherche du lien correspondant au slug dans la base de données
  const link = await db
    .select()                           // Requête SELECT
    .from(links)                        // Table cible : "links"
    .where(eq(links.slug, slug))        // Filtrer où "links.slug" est égal au paramètre récupéré
    .then((res) => res[0]);             // Récupère uniquement le premier résultat trouvé

  // Vérifie si aucun lien correspondant n'a été trouvé
  if (!link) {
    throw createError({
      statusCode: 404,                 // Erreur 404 : Ressource non trouvée
      statusMessage: "Lien non trouvé pour le slug fourni.",
    });
  }

  // Redirige l'utilisateur vers l'URL d'origine trouvée dans la base de données
  return sendRedirect(event, link.url, 302); // Redirection temporaire (code HTTP 302)
});
