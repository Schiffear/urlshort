// Importe et charge les variables d'environnement définies dans le fichier .env
import 'dotenv/config';

// Importe la fonction drizzle depuis drizzle-orm pour la configuration avec PostgreSQL en mode Node.js
import { drizzle } from 'drizzle-orm/node-postgres';

// Initialise la connexion à la base de données en utilisant l'URL fournie dans la variable d'environnement DATABASE_URL
// Le point d'exclamation (!) indique que la variable DATABASE_URL ne sera pas undefined à ce stade (non-null assertion operator)
const db = drizzle(process.env.DATABASE_URL!);
