import { z } from 'zod';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { GithubOAuthResponse } from '~/types/github';

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

// Fonction pour vérifier le token JWT
const requireUser = async (event: any) => {
  try {
    // Récupérer le token depuis les headers de la requête
    const authHeader = event.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Token manquant ou format incorrect');
    }

    // Extraire le token de l'header 'Authorization'
    const token = authHeader.substring(7); // "Bearer " est retiré du début

    // Vérifier la validité du token
    const decoded = jwt.verify(token, '09765a3505e4151d3bcb3d6f58f4d17d2d874862', {
      audience: 'url-shortener', // vérifier que le token est destiné à notre application
    }) as JwtPayload;

    // Si tout est valide, retourner les informations de l'utilisateur
    return decoded; // L'utilisateur est contenu dans le payload du token

  } catch (err) {
    // Si le token est invalide ou expiré, lancer une erreur 401
    console.error('Erreur de vérification du token :', err);
    throw createError({
      statusCode: 401,
      statusMessage: 'Token invalide ou expiré',
    });
  }
};

export default defineEventHandler(async (event) => {
  const { github } = useRuntimeConfig(event);

  // Validation du paramètre 'code' dans l'URL à l'aide de Zod
  const query = await getValidatedQuery(event, CodeSchema.parse)

  try {
    // Appel à l'API GitHub pour récupérer le token d'accès OAuth
    const response = await $fetch<GithubOAuthResponse>('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: {
        client_id: github.clientId,
        client_secret: github.clientSecret,
        code, // Code récupéré depuis l'URL
      },
    });

    const { access_token } = response;

    // Utilisation de l'access_token pour récupérer les données utilisateur de GitHub
    const userData = await $fetch<GithubUserData>('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    // Générez un secret pour signer le JWT (cela doit être un secret sécurisé)
    const tokenSecret = '09765a3505e4151d3bcb3d6f58f4d17d2d874862'; // Remplacez ceci par un vrai secret sécurisé

    // Génération du JWT à partir des données utilisateur
    const token = jwt.sign(userData, tokenSecret, {
      expiresIn: '1h', // Durée d'expiration du token
      subject: userData.login, // Identifiant de l'utilisateur (login GitHub)
      audience: 'url-shortener', // Public visé par le token
    });

    let decoded: JwtPayload | null = null;

    try {
      // as JwtPayload permet de s'assurer qu'on aura bien ce type et pas une string
      decoded = jwt.verify(
        token,
        '09765a3505e4151d3bcb3d6f58f4d17d2d874862',
        {
          audience: 'url-shortener', // optionnel: vérifier l'audience pour s'assurer que le token est bien à destination de notre application
        }
      ) as JwtPayload;
    } catch (err) {
      // Si le token est invalide quelle que soit la raison, on va arriver ici
      console.error(err);
    }

    const isJwtValid = decoded !== null;

    if (isJwtValid) {
      console.log('Token généré et validé:', token);
    } else {
      throw new Error('Le token est invalide.');
    }

    // Vérification que l'utilisateur est authentifié avec le token
    const user = await requireUser(event);
    console.log('Utilisateur authentifié:', user);

  } catch (error) {
    console.error('Erreur lors de la récupération du token OAuth ou des données utilisateur :', error);
    throw new Error('Erreur lors de l\'authentification GitHub');
  }
});