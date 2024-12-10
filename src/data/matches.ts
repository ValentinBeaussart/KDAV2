export interface Match {
  id: number;
  date: string;
  time: string;
  location: string;
  homeTeam: {
    name: string;
    logo: string;
    score?: number;
    scorers?: Array<{ name: string; goals: number }>;
  };
  awayTeam: {
    name: string;
    logo: string;
    score?: number;
    scorers?: Array<{ name: string; goals: number }>;
  };
  isCompleted: boolean;
}

export const matches: Match[] = [
  {
    id: 1,
    date: "2024-04-01",
    time: "15:00",
    location: "Stade Municipal",
    homeTeam: {
      name: "KDA Sporting Club",
      logo: "/logos/kda.png",
      score: 3,
      scorers: [
        { name: "Alexandre Dupont", goals: 2 },
        { name: "Thomas Martin", goals: 1 }
      ]
    },
    awayTeam: {
      name: "Racing Club",
      logo: "/logos/racing.png",
      score: 1,
      scorers: [
        { name: "Jean Michel", goals: 1 }
      ]
    },
    isCompleted: true
  },
  {
    id: 2,
    date: "2024-04-15",
    time: "16:30",
    location: "Stade Olympique",
    homeTeam: {
      name: "Olympique FC",
      logo: "/logos/olympique.png",
      score: 2,
      scorers: [
        { name: "Pierre Durant", goals: 2 }
      ]
    },
    awayTeam: {
      name: "KDA Sporting Club",
      logo: "/logos/kda.png",
      score: 2,
      scorers: [
        { name: "Lucas Bernard", goals: 2 }
      ]
    },
    isCompleted: true
  },
  {
    id: 3,
    date: "2024-05-15",
    time: "15:00",
    location: "Stade Municipal",
    homeTeam: {
      name: "KDA Sporting Club",
      logo: "/logos/kda.png"
    },
    awayTeam: {
      name: "AS Saint-Étienne",
      logo: "/logos/asse.png"
    },
    isCompleted: false
  },
  {
    id: 4,
    date: "2024-05-29",
    time: "20:00",
    location: "Stade des Sports",
    homeTeam: {
      name: "United SC",
      logo: "/logos/united.png"
    },
    awayTeam: {
      name: "KDA Sporting Club",
      logo: "/logos/kda.png"
    },
    isCompleted: false
  }
];