import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

// Schéma Zod pour valider les données de 'visits'
const visitsSchema = z.object({
  id: z.string().min(1, { message: "L'ID doit être une chaîne non vide." }),
  link_id: z.string().min(1, { message: "Le 'link_id' est requis et doit être une chaîne non vide." }),
  created_at: z.date().refine(date => !isNaN(date.getTime()), { message: "La 'created_at' doit être une date valide." }),
  ip: z.string().min(1, { message: "L'adresse IP est requise et doit être une chaîne non vide." }),
  user_agent: z.string().min(1, { message: "Le 'user_agent' est requis et doit être une chaîne non vide." }),
});

// Définition de la table 'visits' pour enregistrer les visites des liens
export const visits = pgTable('visits', {
  // Colonne 'id' utilisée comme clé primaire
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

// Fonction pour valider les données avant d'insérer dans la table
export const validateVisitData = (data: {
  id: string;
  link_id: string;
  created_at: Date;
  ip: string;
  user_agent: string;
}) => {
  // Valide les données à l'aide du schéma Zod
  visitsSchema.parse(data); // Si les données ne respectent pas le schéma, une erreur sera levée
};
