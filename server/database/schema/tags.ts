import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { z } from "zod";

// Schéma Zod pour valider les données de 'tags'
const tagsSchema = z.object({
  id: z.number().int().min(1, { message: "L'id doit être un entier valide." }),
  name: z.string().min(1, { message: "Le 'name' est requis et doit être une chaîne non vide." }).max(255, { message: "Le 'name' ne peut pas dépasser 255 caractères." }),
  color: z.string().min(1, { message: "La 'color' est requise et doit être une chaîne non vide." }),
});

// Définition de la table 'tags' pour gérer les informations des tags
export const tags = pgTable('tags', {
  // Colonne 'id' utilisée comme clé primaire
  id: integer().primaryKey(),
  
  // Colonne 'name' obligatoire et unique pour stocker le nom du tag
  name: text().unique().notNull(),
  
  // Colonne 'color' obligatoire pour stocker la couleur associée au tag
  color: text().notNull(),
});

// Fonction pour valider les données avant d'insérer dans la table
export const validateTagData = (data: {
  id: number;
  name: string;
  color: string;
}) => {
  // Valide les données à l'aide du schéma Zod
  tagsSchema.parse(data); // Si les données ne respectent pas le schéma, une erreur sera levée
};
