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
    thumbnail: "",
    title: "Le KDA fête la montée",
    description: "Le KDA fête la victoire qui lui permet de monter dans l'élite",
    date: "22/06/2024"
  },
  {
    id: 2,
    url: "../../kda-lucarnidor.jpg",
    thumbnail: "",
    title: "Lucarnid'Or Ligue Panache",
    description: "Notre joueur avec le trophée Lucarnid'Or",
    date: "15/09/2024"
  },
  {
    id: 3,
    url: "/kda-trophee.jpg",
    thumbnail: "",
    title: "Le président avec le trophée",
    description: "Notre président qui pose fièrement avec le trophée de la ligue Panache",
    date: "25/08/2024"
  }
];