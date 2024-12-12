import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { type JwtPayload } from 'jsonwebtoken';
import { GithubOAuthResponse } from '~/types/github';
import { useRuntimeConfig } from '#imports';

// Définition de l'interface pour les données utilisateur récupérées de GitHub
export interface GithubUserData {
  login: string;
  id: number;
  avatar_url: string;
  email: string;
  // Ajouter d'autres données au besoin
}

// Définition du schéma Zod pour valider le paramètre `code` dans l'URL
const CodeSchema = z.object({
  code: z.string().min(1, { message: "Le code d'authentification est requis." }),
});

export default defineEventHandler(async (event) => {
  // Récupérer la configuration à l'aide de `useRuntimeConfig()`
  const config = useRuntimeConfig(); 

  // Validation du paramètre 'code' dans l'URL à l'aide de Zod
  const { code } = await getValidatedQuery(event, CodeSchema.parse);

  try {
    // Appel à l'API GitHub pour récupérer le token d'accès OAuth
    console.log("Demande de token GitHub...");
    const response = await $fetch<GithubOAuthResponse>('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: {
        client_id: config.github.clientId, // Utiliser les variables de config
        client_secret: config.github.clientSecret, // Utiliser les variables de config
        code, // Code récupéré depuis l'URL
      },
    });

    console.log("Réponse de GitHub:", response);
    const { access_token } = response;

    // Utilisation de l'access_token pour récupérer les données utilisateur de GitHub
    console.log("Récupération des données utilisateur...");
    const userData = await $fetch<GithubUserData>('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    console.log("Données utilisateur récupérées:", userData);

    // Utilisation du secret JWT depuis la configuration runtime
    console.log("Génération du token JWT...");
    const tokenSecret = config.jwt.jwt_secret; // Ici, on utilise config pour accéder à jwt_secret

    // Limiter les données utilisateur dans le payload JWT
    const payload = {
      login: userData.login, // Identifiant GitHub
      id: userData.id,       // ID utilisateur GitHub
      email: userData.email, // Email (si disponible)
    };

    // Génération du JWT à partir des données utilisateur
    const token = jwt.sign(payload, tokenSecret, {
      expiresIn: '1h', // Durée d'expiration du token
      subject: userData.login, // Identifiant de l'utilisateur (login GitHub)
      audience: 'url-shortener', // Public visé par le token
    });

    return { token };
  } catch (error) {
    console.error('Erreur lors de la récupération du token OAuth ou des données utilisateur :', error);
    throw new Error('Erreur lors de l\'authentification GitHub');
  }
});
