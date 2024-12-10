export interface Team {
  position: number;
  logo: string;
  name: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export const standings: Team[] = [
  {
    position: 1,
    logo: "/logos/kda.png",
    name: "KDA Sporting Club",
    played: 25,
    won: 18,
    drawn: 4,
    lost: 3,
    goalsFor: 52,
    goalsAgainst: 18,
    goalDifference: 34,
    points: 58
  },
  {
    position: 2,
    logo: "/logos/racing.png",
    name: "Racing Club",
    played: 25,
    won: 17,
    drawn: 5,
    lost: 3,
    goalsFor: 48,
    goalsAgainst: 20,
    goalDifference: 28,
    points: 56
  },
  {
    position: 3,
    logo: "/logos/olympique.png",
    name: "Olympique FC",
    played: 25,
    won: 16,
    drawn: 4,
    lost: 5,
    goalsFor: 45,
    goalsAgainst: 25,
    goalDifference: 20,
    points: 52
  },
  {
    position: 4,
    logo: "/logos/united.png",
    name: "United SC",
    played: 25,
    won: 14,
    drawn: 6,
    lost: 5,
    goalsFor: 40,
    goalsAgainst: 28,
    goalDifference: 12,
    points: 48
  },
  {
    position: 5,
    logo: "/logos/athletic.png",
    name: "Athletic Club",
    played: 25,
    won: 13,
    drawn: 5,
    lost: 7,
    goalsFor: 38,
    goalsAgainst: 30,
    goalDifference: 8,
    points: 44
  }
];