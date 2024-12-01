export default defineEventHandler(event => {
  const { github } = useRuntimeConfig(event)
  const scope = 'user'; // No additional scopes required to read profile. Add more scopes if you need more permissions.
  
  // Build your authorize URL here
  const url = new URL('... ?');
  url.searchParams.append('?', ' ?');

  return sendRedirect(event, '?');
})