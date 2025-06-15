import { Expansion } from "./expansion";

export interface Card {
  id: number;
  code: string;
  name: string;
  image?: string;
  description: string;
  type: string;
  typing: string;
  attribute: string;
  level: number;
  attack: number;
  defense: number;
  rarity: string;
  quantity?: number; 
  expansion?: Expansion;
}
