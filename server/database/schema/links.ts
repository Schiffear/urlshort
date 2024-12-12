// Importe les types et fonctions nécessaires pour définir une table PostgreSQL avec Drizzle ORM
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

// Importe le schéma 'tags', potentiellement utilisé pour les relations (non utilisé ici directement)
import { tags } from "./tags";

// Important: exporte la variable pour que Drizzle puisse la détecter et l'importer dans l'application
export const links = pgTable('links', {
  // Colonne 'slug' utilisée comme clé primaire
  slug: text().primaryKey(),
  
  // Colonne 'url' obligatoire (non-null) pour stocker l'URL associée
  url: text().notNull(),
  
  // Colonne 'title' obligatoire pour stocker le titre associé au lien
  title: text().notNull(),
  
  // Colonne 'max_visits' pour définir un nombre maximum de visites autorisées (optionnel)
  max_visits: integer(),
  
  // Colonne 'available_at' obligatoire pour spécifier la date/heure de disponibilité du lien
  available_at: timestamp().notNull(),
  
  // Colonne 'expired_at' pour spécifier la date/heure d'expiration du lien (optionnelle)
  expired_at: timestamp(),
  
  // Colonne 'created_at' obligatoire pour indiquer la date/heure de création du lien
  created_at: timestamp().notNull(),
  
  // Colonne 'update_at' obligatoire pour la date/heure de dernière mise à jour du lien
  update_at: timestamp().notNull(),
});
