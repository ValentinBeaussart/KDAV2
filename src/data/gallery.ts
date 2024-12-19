export interface GalleryImage {
  id: number;
  url: string;
  thumbnail: string;
  title: string;
  description: string;
  date: string;
}

export const galleryImages: GalleryImage[] = [
  {
    id: 1,
    url: "/kda-celebration.jpg",
    thumbnail: "/kda-celebration.jpg",
    title: "Le KDA fête la montée",
    description: "Le KDA fête la victoire qui lui permet de monter dans l'élite",
    date: "06/22/2024"
  },
  {
    id: 2,
    url: "/kda-lucarnidor.jpg",
    thumbnail: "/kda-lucarnidor.jpg",
    title: "Lucarnid'Or Ligue Panache",
    description: "Notre joueur avec le trophée Lucarnid'Or",
    date: "09/15/2024"
  },
  {
    id: 3,
    url: "/kda-equipe.jpg",
    thumbnail: "/kda-equipe.jpg",
    title: "Photo d'équipe",
    description: "Photo d'équipe",
    date: "08/25/2024"
  }
];