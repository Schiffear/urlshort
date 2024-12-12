import { eq } from "drizzle-orm";               // Importe l'opérateur "eq" pour effectuer une comparaison d'égalité dans une requête SQL
import { links } from "~/database/schema";      // Importe le modèle "links" qui représente la table "links" dans la base de données
import { useDrizzle } from "~/utils/drizzle";   // Importe la fonction utilitaire qui permet d'utiliser Drizzle ORM pour interagir avec la base de données

export default defineEventHandler(async event => {
    const db = useDrizzle(); // Crée une instance de Drizzle ORM pour interagir avec la base de données via l'objet db
    const body = await readBody(event); // Lit le corps de la requête, qui devrait contenir les données à mettre à jour
    const slug = getRouterParam(event, 'slug'); // Récupère le paramètre dynamique "slug" depuis l'URL de la requête

    console.log(body); // Affiche le contenu du corps de la requête dans la console pour le débogage
  
    // Exécute une requête SQL de mise à jour sur la table "links"
    await db.update(links)                           // Démarre une mise à jour de la table "links"
        .set({ title: body.title, update_at: new Date() }) // Définit les nouveaux champs : "title" et la date de mise à jour ("update_at")
        .where(eq(links.slug, slug))                // Applique une condition : l'élément à mettre à jour doit avoir le même "slug" que celui récupéré dans l'URL
        .returning({ updatedId: links.slug });      // Retourne le "slug" de l'élément mis à jour sous le nom "updatedId"

    return { body }; // Renvoie le corps de la requête comme réponse pour confirmer les données envoyées
});
