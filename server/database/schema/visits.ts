// Importe les types nécessaires pour définir une table PostgreSQL avec Drizzle ORM
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

// Définition de la table 'visits' pour enregistrer les visites des liens
export const visits = pgTable('visits', {
  // Colonne 'id' utilisée comme clé primaire, de type texte
  id: text().primaryKey(),

  // Colonne 'link_id' obligatoire pour faire référence au lien visité
  link_id: text().notNull(),

  // Colonne 'created_at' obligatoire pour enregistrer la date et l'heure de la visite
  created_at: timestamp().notNull(),

  // Colonne 'ip' obligatoire pour enregistrer l'adresse IP de l'utilisateur
  ip: text().notNull(),

  // Colonne 'user_agent' obligatoire pour stocker les informations du User-Agent de l'utilisateur
  user_agent: text().notNull(),
});
