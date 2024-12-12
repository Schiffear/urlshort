// Importe les types et fonctions nécessaires pour définir une table PostgreSQL avec Drizzle ORM
import { integer, PgSerial, pgTable, serial, smallint, smallserial, text, timestamp } from "drizzle-orm/pg-core";

// Définition de la table 'tags' pour stocker les informations des tags
export const tags = pgTable('tags', {
  // Colonne 'id' utilisée comme clé primaire, de type texte
  id: integer().primaryKey(),
  
  // Colonne 'name' obligatoire et unique pour stocker le nom du tag
  name: text().unique().notNull(),
  
  // Colonne 'color' obligatoire pour stocker la couleur associée au tag
  color: text().notNull(),
});
