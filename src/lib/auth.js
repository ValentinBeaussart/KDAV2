export function isAuthenticated(username, password) {
  const envUsername = import.meta.env.ADMIN_USERNAME;
  const envPassword = import.meta.env.ADMIN_PASSWORD;

  // Vérifiez si les identifiants fournis correspondent à ceux dans le fichier .env
  return username === envUsername && password === envPassword;
}
export function protectRoute(Astro) {
  console.log('Vérification de la session');

  // Récupérer tous les cookies
  const cookies = Astro.request.headers.get("cookie") || "";
  
  // Trouver le cookie de session
  const sessionCookie = cookies.split("; ").find((c) => c.startsWith("session="));
  
  // Extraire la valeur du cookie de session
  const sessionValue = sessionCookie ? sessionCookie.split("=")[1] : null;

  // Vérifier si la session est valide
  if (!sessionValue || sessionValue !== "valid") {
    console.log('Redirection : session invalide ou inexistante');
    return Astro.redirect("/login");
  }

  console.log('Session valide : accès autorisé');
}

