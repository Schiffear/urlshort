// Importation des outils nécessaires pour la gestion de la base de données
import { useDrizzle } from "~/utils/drizzle";  // Utilisation de Drizzle ORM pour la gestion de la base de données
import { links } from "~/database/schema";     // Importation du modèle de la table 'links' depuis le schéma de la base de données
import { count } from "drizzle-orm";            // Fonction 'count' pour obtenir le nombre de lignes dans une table

// Définition de l'handler pour l'endpoint "/links"
export default eventHandler(async (event) => {
  const db = useDrizzle();  // Initialisation de la connexion à la base de données via Drizzle ORM

  // Récupérer les paramètres de la requête pour la pagination
  // Par défaut, page = 1 et limit = 3 (nombre de liens par page)
  const { page = 1, limit = 3 } = getQuery(event); // Récupération des paramètres 'page' et 'limit' dans l'URL de la requête

  // Validation des paramètres 'page' et 'limit' pour s'assurer qu'ils sont des entiers positifs
  const pageNumber = parseInt(page as string, 10);   // Convertir 'page' en entier
  const pageSize = parseInt(limit as string, 10);    // Convertir 'limit' en entier
  
  // Si la page est invalide (inférieur à 1), lever une erreur
  if (isNaN(pageNumber) || pageNumber < 1) {
    throw createError({
      statusCode: 400,            // Code HTTP pour les requêtes incorrectes
      message: "La page doit être un nombre entier positif.", // Message d'erreur
    });
  }

  // Si le nombre de résultats par page est invalide (inférieur à 1), lever une erreur
  if (isNaN(pageSize) || pageSize < 1) {
    throw createError({
      statusCode: 400,           // Code HTTP pour les requêtes incorrectes
      message: "Le nombre de résultats par page doit être un nombre entier positif.", // Message d'erreur
    });
  }

  // Calcul de l'offset pour la pagination : déterminer où commencer à récupérer les liens
  const offset = (pageNumber - 1) * pageSize; // Décalage en fonction de la page et de la taille de la page

  // Récupérer les résultats de la table 'links' avec pagination
  // La requête récupère seulement un nombre limité de résultats en fonction de la page demandée
  const results = await db.query.links.findMany({
    limit: pageSize,  // Limiter le nombre de résultats à 'pageSize'
    offset,            // Appliquer le décalage pour sauter les résultats précédents
  });

  // Récupérer le nombre total de liens dans la table 'links'
  const totalLinksResult = await db
    .select({ count: count() })  // Exécuter une requête pour compter le nombre total de liens
    .from(links);                // Spécifier la table 'links' pour compter les lignes

  // Extraction du nombre total de liens à partir du résultat de la requête
  const totalLinks = totalLinksResult[0]?.count || 0; // Si aucun résultat, retourner 0 comme nombre total

  // Calculer le nombre total de pages en divisant le nombre total de liens par la taille de page
  const totalPages = Math.ceil(totalLinks / pageSize);  // Math.ceil() permet d'arrondir le résultat au nombre entier supérieur

  // Retourner la réponse avec les résultats, la page actuelle, la taille de la page, le total des liens et le nombre total de pages
  return {
    statusCode: 200,  // Code de statut HTTP pour une réponse réussie
    body: {           // Corps de la réponse
      data: results,      // Résultats des liens de la page actuelle
      page: pageNumber,   // Numéro de la page actuelle
      limit: pageSize,    // Nombre de résultats par page
      total: totalLinks,  // Nombre total de liens dans la table
      totalPages: totalPages, // Nombre total de pages
    },
  };
});
