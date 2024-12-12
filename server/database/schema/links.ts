import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

// Schéma Zod pour valider les données de 'links'
const linksSchema = z.object({
  slug: z.string().min(1, { message: "Le 'slug' est requis et doit être une chaîne non vide." }),
  url: z.string().url({ message: "L'URL doit être une URL valide." }),
  title: z.string().min(1, { message: "Le 'title' est requis et doit être une chaîne non vide." }),
  max_visits: z.number().int().optional(),
  available_at: z.date().refine(date => !isNaN(date.getTime()), { message: "La 'available_at' doit être une date valide." }),
  expired_at: z.date().refine(date => !isNaN(date.getTime()), { message: "La 'expired_at' doit être une date valide." }).optional(),
  created_at: z.date().refine(date => !isNaN(date.getTime()), { message: "La 'created_at' doit être une date valide." }),
  update_at: z.date().refine(date => !isNaN(date.getTime()), { message: "La 'update_at' doit être une date valide." }),
});

// Définition de la table 'links' pour gérer les liens
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

// Fonction pour valider les données avant d'insérer dans la table
export const validateLinkData = (data: {
  slug: string;
  url: string;
  title: string;
  max_visits?: number;
  available_at: Date;
  expired_at?: Date;
  created_at: Date;
  update_at: Date;
}) => {
  // Valide les données à l'aide du schéma Zod
  linksSchema.parse(data); // Si les données ne respectent pas le schéma, une erreur sera levée
};
