import { integer, pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { links } from "./links";
import { tags } from "./tags";
import { z } from "zod";

// Schéma Zod pour valider les données de 'link_tags'
const linkTagsSchema = z.object({
  link_slug: z.string().min(1, { message: "Le 'link_slug' est requis et doit être une chaîne non vide." }),
  tag_id: z.number().int().positive({ message: "Le 'tag_id' doit être un entier positif." }),
});

// Définition de la table d'association 'link_tags' pour gérer la relation many-to-many entre 'links' et 'tags'
export const link_tags = pgTable(
  'link_tags', // Nom de la table dans la base de données
  {
    // Colonne 'link_slug' qui référence la colonne 'slug' de la table 'links'
    link_slug: text().references(() => links.slug).notNull(),
    
    // Colonne 'tag_id' qui référence la colonne 'id' de la table 'tags'
    tag_id: integer().references(() => tags.id).notNull(),
  },
  (columns) => ({
    // Définition de la clé primaire composite basée sur 'link_slug' et 'tag_id'
    pk: primaryKey({ columns: [columns.link_slug, columns.tag_id] }),
  })
);

// Fonction pour valider les données avant d'insérer dans la table
export const validateLinkTagData = (data: { link_slug: string; tag_id: number }) => {
  // Valide les données à l'aide du schéma Zod
  linkTagsSchema.parse(data); // Si les données ne respectent pas le schéma, une erreur sera levée
};
