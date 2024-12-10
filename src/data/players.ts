export interface Player {
  id: number;
  name: string;
  number: number;
  position: string;
  photo: string;
  stats: {
    appearances: number;
    goals: number;
    assists: number;
  };
}

export const players: Player[] = [
  {
    id: 1,
    name: "Alexandre Dupont",
    number: 9,
    position: "Attaquant",
photo: "/player.webp",
    stats: {
      appearances: 20,
      goals: 15,
      assists: 8
    }
  },
  {
    id: 2,
    name: "Thomas Martin",
    number: 10,
    position: "Milieu Offensif",
    photo: "/player.webp",
    stats: {
      appearances: 18,
      goals: 12,
      assists: 15
    }
  },
  {
    id: 3,
    name: "Lucas Bernard",
    number: 7,
    position: "Ailier",
   photo: "/player.webp",
    stats: {
      appearances: 19,
      goals: 10,
      assists: 12
    }
  },
  // Ajoutez d'autres joueurs selon vos besoins
];