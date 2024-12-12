export default defineEventHandler(event => {
  const { github } = useRuntimeConfig(event);
  console.log('Client ID:', github.clientId); // Afficher le client ID
  console.log('Redirect URI:', github.redirectUri);

  // Vérification de la présence des variables nécessaires
  if (!github.clientId || !github.redirectUri) {
    throw new Error('Client ID ou Redirect URI manquant dans la configuration GitHub');
  }

  const scope = 'user'; // Scopes demandés
  const url = new URL('http://localhost:3000/auth/callback');

  // Client ID pour identifier votre app
  url.searchParams.append('client_id', github.clientId);

  // URL où l'utilisateur sera redirigé une fois authentifié
  url.searchParams.append('redirect_uri', github.redirectUri);

  // Scopes demandés. Un scope est une permission, cela donne droit à votre app d'effectuer une action à la place de l'utilisateur
  url.searchParams.append('scope', scope);

  console.log('Redirection vers GitHub:', url.toString());  // Afficher l'URL de redirection vers GitHub

  // Redirige l'utilisateur vers la page de login de Github
  return sendRedirect(event, url.toString());
});