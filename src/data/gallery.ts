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
    url: "/gallery/match1.jpg",
    thumbnail: "/gallery/thumbnails/match1.jpg",
    title: "Victoire contre Racing Club",
    description: "Match décisif remporté 3-1",
    date: "2024-04-01"
  },
  {
    id: 2,
    url: "/gallery/match2.jpg",
    thumbnail: "/gallery/thumbnails/match2.jpg",
    title: "Entraînement d'équipe",
    description: "Séance tactique",
    date: "2024-03-28"
  },
  {
    id: 3,
    url: "/gallery/match3.jpg",
    thumbnail: "/gallery/thumbnails/match3.jpg",
    title: "Célébration d'équipe",
    description: "Après la qualification en coupe",
    date: "2024-03-15"
  }
];