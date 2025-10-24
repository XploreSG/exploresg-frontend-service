import { createContext } from "react";

export interface CollectedItem {
  id: string;
  type: "attraction" | "event" | "food";
  name: string;
  collectedAt: number; // timestamp
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  category: "all" | "attraction" | "event" | "food";
  unlocked: boolean;
}

export interface CollectionContextType {
  collectedItems: CollectedItem[];
  badges: Badge[];
  addToCollection: (item: CollectedItem) => void;
  removeFromCollection: (id: string) => void;
  isCollected: (id: string) => boolean;
  getCollectionCount: (type?: "attraction" | "event" | "food") => number;
}

export const CollectionContext = createContext<
  CollectionContextType | undefined
>(undefined);
