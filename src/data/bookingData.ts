export type PlayerType = 1 | 2 | 3 | 4 | "vr";

export interface SectionOption {
  players: PlayerType;
  price: number;
  duration: number; // minutes
  games: string[];
}

export interface Section {
  id: number;
  label: string;
  options: SectionOption[];
}

export const SECTIONS: Section[] = [
  {
    id: 1,
    label: "Section 1",
    options: [
      { players: 1, price: 100, duration: 30, games: ["Assetto Corsa Competizione", "Gran Turismo", "NFS Unbound", "Monster Jam Showdown", "Forza Horizon 5", "F1 25"] },
      { players: 2, price: 200, duration: 60, games: ["Gran Turismo", "Monster Jam Showdown", "F1 25"] },
    ],
  },
  {
    id: 2,
    label: "Section 2",
    options: [
      { players: 1, price: 100, duration: 60, games: ["Cricket 26", "NBA 2K26", "FC 26", "God of War", "GTA 5"] },
      { players: 2, price: 150, duration: 60, games: ["Cricket 26", "NBA 2K26", "FC 26", "God of War", "Call of Duty"] },
      { players: 3, price: 250, duration: 60, games: ["Cricket 26", "NBA 2K26", "FC 26"] },
      { players: 4, price: 300, duration: 60, games: ["Cricket 26", "NBA 2K26", "FC 26"] },
    ],
  },
  {
    id: 3,
    label: "Section 3",
    options: [
      { players: 1, price: 100, duration: 60, games: ["Wukong", "NBA 2K25", "Uncharted", "Street Fighter 6", "Cricket 26", "Minecraft", "Call of Duty Vanguard"] },
      { players: 2, price: 150, duration: 60, games: ["NBA 2K25", "Street Fighter 6", "Cricket 26", "Call of Duty Vanguard"] },
      { players: 3, price: 250, duration: 60, games: ["NBA 2K25", "Cricket 26"] },
      { players: 4, price: 300, duration: 60, games: ["NBA 2K25", "Cricket 26"] },
    ],
  },
  {
    id: 4,
    label: "Section 4",
    options: [
      { players: 1, price: 100, duration: 60, games: ["Mortal Kombat 1", "NBA 2K25", "Uncharted", "Street Fighter 6", "Cricket 26", "Tennis 2", "Cricket 24", "Spider-Man Miles Morales", "Until Dawn"] },
      { players: 2, price: 150, duration: 60, games: ["Mortal Kombat 1", "NBA 2K25", "Street Fighter 6", "Cricket 26", "Tennis 2", "Cricket 24"] },
      { players: 3, price: 250, duration: 60, games: ["NBA 2K25", "Cricket 26", "Tennis 2", "Cricket 24"] },
      { players: 4, price: 300, duration: 60, games: ["NBA 2K25", "Cricket 26", "Tennis 2", "Cricket 24"] },
    ],
  },
  {
    id: 5,
    label: "Section 5",
    options: [
      { players: 1, price: 100, duration: 60, games: ["Tekken 8", "Mortal Kombat 1", "Ghost of Tsushima", "The Last of Us Part 2", "The Last of Us Part 1", "Resident Evil 4"] },
      { players: "vr", price: 100, duration: 60, games: ["Resident Evil Village", "Resident Evil 4", "Dead Land", "Swordsman", "Metro Awakening", "Metal Hellsinger"] },
      { players: 2, price: 150, duration: 60, games: ["Tekken 8", "Mortal Kombat 1"] },
    ],
  },
  {
    id: 6,
    label: "Section 6",
    options: [
      { players: 1, price: 100, duration: 60, games: ["Tekken 8", "NBA 2K26", "FC 26", "Spider-Man 2", "The Last of Us Part 1", "Helldivers", "Elden Ring", "Ronin", "Cyberpunk"] },
      { players: 2, price: 150, duration: 60, games: ["Tekken 8", "NBA 2K26", "FC 26"] },
      { players: 3, price: 250, duration: 60, games: ["NBA 2K26", "FC 26"] },
      { players: 4, price: 300, duration: 60, games: ["NBA 2K26", "FC 26"] },
    ],
  },
  {
    id: 7,
    label: "Section 7",
    options: [
      { players: 1, price: 100, duration: 60, games: ["Tekken 8", "NBA 2K25", "FC 26", "UFC 5", "Call of Duty Vanguard", "Mafia", "Tennis 2"] },
      { players: 2, price: 150, duration: 60, games: ["Tekken 8", "NBA 2K25", "FC 26", "UFC 5", "Call of Duty Vanguard", "Tennis 2"] },
      { players: 3, price: 250, duration: 60, games: ["NBA 2K25", "FC 26", "Tennis 2", "NBA 2K26"] },
      { players: 4, price: 300, duration: 60, games: ["NBA 2K25", "FC 26", "Tennis 2"] },
    ],
  },
  {
    id: 8,
    label: "Section 8",
    options: [
      { players: 1, price: 100, duration: 60, games: ["GTA 5", "God of War", "Black Myth Wukong", "WWE", "Elden Ring", "Spider-Man Miles Morales", "Death Stranding 2", "Death Stranding 1", "Ghost of Tsushima"] },
      { players: 2, price: 150, duration: 60, games: ["WWE"] },
      { players: 3, price: 250, duration: 60, games: ["WWE"] },
      { players: 4, price: 300, duration: 60, games: ["WWE"] },
    ],
  },
  {
    id: 9,
    label: "Section 9",
    options: [
      { players: 1, price: 100, duration: 60, games: ["GTA 5", "God of War", "Spider-Man Remastered", "The Last of Us Part 2", "Resident Evil Requiem", "Mortal Kombat 1", "Undisputed", "MotoGP 25"] },
      { players: 2, price: 150, duration: 60, games: ["Mortal Kombat 1", "Undisputed"] },
      { players: 3, price: 250, duration: 60, games: ["Mortal Kombat 1", "Undisputed"] },
      { players: 4, price: 300, duration: 60, games: ["Mortal Kombat 1", "Undisputed"] },
    ],
  },
  {
    id: 10,
    label: "Section 10",
    options: [
      { players: 1, price: 100, duration: 60, games: ["FC 26", "NBA 2K25", "Cricket 26", "GTA 5", "Tennis", "Tekken", "Mortal Kombat"] },
      { players: 2, price: 150, duration: 60, games: ["FC 26", "NBA 2K25", "Cricket 26", "Tennis", "Tekken", "Mortal Kombat"] },
      { players: 3, price: 250, duration: 60, games: ["FC 26", "NBA 2K25", "Cricket 26", "Tennis"] },
      { players: 4, price: 300, duration: 60, games: ["FC 26", "NBA 2K25", "Cricket 26", "Tennis"] },
    ],
  },
];

export function getSectionsForPlayerType(playerType: PlayerType): Section[] {
  if (playerType === "vr") {
    return SECTIONS.filter((s) => s.options.some((o) => o.players === "vr"));
  }
  return SECTIONS.filter((s) => s.options.some((o) => o.players === playerType));
}

export function getOptionForSection(section: Section, playerType: PlayerType): SectionOption | undefined {
  return section.options.find((o) => o.players === playerType);
}

export function getGamesForSelection(sectionId: number, playerType: PlayerType): string[] {
  const section = SECTIONS.find((s) => s.id === sectionId);
  if (!section) return [];
  const option = section.options.find((o) => o.players === playerType);
  return option?.games || [];
}

export function getPriceAndDuration(sectionId: number, playerType: PlayerType): { price: number; duration: number } | null {
  const section = SECTIONS.find((s) => s.id === sectionId);
  if (!section) return null;
  const option = section.options.find((o) => o.players === playerType);
  if (!option) return null;
  return { price: option.price, duration: option.duration };
}
