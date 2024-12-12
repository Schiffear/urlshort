import { integer, pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { links } from "./links";
import { tags } from "./tags";

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
