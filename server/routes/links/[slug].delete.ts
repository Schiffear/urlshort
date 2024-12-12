import { eq } from "drizzle-orm";               // Importe l'opérateur "eq" pour effectuer des comparaisons dans les requêtes SQL
import { links } from "~/database/schema";      // Importe la table "links" définie dans ton schéma Drizzle ORM
import { useDrizzle } from "~/utils/drizzle";   // Fonction personnalisée pour initialiser et utiliser Drizzle ORM

// -- DELETE -- // Suppression d'une entrée par son "slug"

export default defineEventHandler(async event => {
    // Initialise la base de données en utilisant Drizzle ORM
    const db = useDrizzle();

    // Récupère le paramètre "slug" à partir de l'URL via le routeur /links/:slug
    const slug = getRouterParam(event, 'slug');

    // Exécute une requête DELETE pour supprimer une ligne de la table "links"
    // où la valeur de la colonne "slug" correspond au paramètre récupéré
    const results = await db.delete(links).where(eq(links.slug, slug));

    // Retourne les résultats de la suppression (confirmation ou détails de la requête)
    return results;
});
