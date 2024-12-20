import { supabase } from './db/connection'; // Assurez-vous que le chemin est correct

// Fonction qui gère le login
export async function handleLogin(event) {
  event.preventDefault();

  // Récupérer les valeurs des champs email et password
  const email = event.target.email.value;
  const password = event.target.password.value;

  // Appeler l'API de Supabase pour s'authentifier
  const { user, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // Gestion des erreurs
  if (error) {
    console.error('Erreur de connexion:', error.message);
    alert('Erreur de connexion : ' + error.message);
  } else {
    console.log('Utilisateur connecté:', user);
    // Rediriger vers la page /admin si la connexion est réussie
    window.location.href = '/admin';
  }
}

// Ajouter un listener à votre formulaire une fois que la page est chargée
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form'); // Sélectionner le formulaire
  if (form) {
    form.addEventListener('submit', handleLogin); // Ajouter l'événement "submit"
  }
});
