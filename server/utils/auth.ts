import jwt, { type JwtPayload } from 'jsonwebtoken';
import type { H3Event } from 'h3'

export function requireUser(event: H3Event) {
    try {
        // Récupérer le token depuis les headers de la requête
        const authHeader = getHeader(event, 'Authorization');
        console.log({authHeader})
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw createError({
                statusCode: 401,
                message: 'Token manquant'
            })
        }

        // Extraire le token de l'header 'Authorization'
        const token = authHeader.substring(7); // "Bearer " est retiré du début
        console.log("Token extrait :", token);

        // Vérifier la validité du token
        const decoded = jwt.verify(token, '09765a3505e4151d3bcb3d6f58f4d17d2d874862', {
            audience: 'url-shortener', // vérifier que le token est destiné à notre application
        }) as JwtPayload;

        // Si tout est valide, retourner les informations de l'utilisateur
        return decoded; // L'utilisateur est contenu dans le payload du token

    } catch (err) {
        // Si le token est invalide ou expiré, lancer une erreur 401
        console.error('Erreur de vérification du token :', err);
        throw sendError(event, createError({
            statusCode: 401,
            message: 'Token invalide ou expiré',
        }));
    }
}
