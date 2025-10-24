import React, { createContext, useContext, useState, useEffect } from "react";

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

interface CollectionContextType {
  collectedItems: CollectedItem[];
  badges: Badge[];
  addToCollection: (item: CollectedItem) => void;
  removeFromCollection: (id: string) => void;
  isCollected: (id: string) => boolean;
  getCollectionCount: (type?: "attraction" | "event" | "food") => number;
}

const CollectionContext = createContext<CollectionContextType | undefined>(
  undefined,
);

const STORAGE_KEY = "exploresg_collection";

// Define badges
const initialBadges: Omit<Badge, "unlocked">[] = [
  {
    id: "explorer",
    name: "Explorer",
    description: "Collect your first place",
    icon: "🎯",
    requirement: 1,
    category: "all",
  },
  {
    id: "adventurer",
    name: "Adventurer",
    description: "Collect 5 places",
    icon: "🗺️",
    requirement: 5,
    category: "all",
  },
  {
    id: "wanderer",
    name: "Wanderer",
    description: "Collect 10 places",
    icon: "🌟",
    requirement: 10,
    category: "all",
  },
  {
    id: "collector",
    name: "Collector",
    description: "Collect 20 places",
    icon: "💎",
    requirement: 20,
    category: "all",
  },
  {
    id: "attraction-fan",
    name: "Attraction Fan",
    description: "Collect 5 attractions",
    icon: "🎡",
    requirement: 5,
    category: "attraction",
  },
  {
    id: "event-goer",
    name: "Event Goer",
    description: "Collect 5 events",
    icon: "🎉",
    requirement: 5,
    category: "event",
  },
  {
    id: "foodie",
    name: "Foodie",
    description: "Collect 5 food places",
    icon: "🍜",
    requirement: 5,
    category: "food",
  },
];

export const CollectionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [collectedItems, setCollectedItems] = useState<CollectedItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCollectedItems(parsed);
      } catch (error) {
        console.error("Failed to parse collection data:", error);
      }
    }
  }, []);

  // Save to localStorage whenever collection changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collectedItems));
  }, [collectedItems]);

  const addToCollection = (item: CollectedItem) => {
    setCollectedItems((prev) => {
      // Check if already collected
      if (prev.some((i) => i.id === item.id)) {
        return prev;
      }
      return [...prev, { ...item, collectedAt: Date.now() }];
    });
  };

  const removeFromCollection = (id: string) => {
    setCollectedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const isCollected = (id: string): boolean => {
    return collectedItems.some((item) => item.id === id);
  };

  const getCollectionCount = (
    type?: "attraction" | "event" | "food",
  ): number => {
    if (!type) {
      return collectedItems.length;
    }
    return collectedItems.filter((item) => item.type === type).length;
  };

  // Calculate badge unlock status
  const badges: Badge[] = initialBadges.map((badge) => {
    const count =
      badge.category === "all"
        ? getCollectionCount()
        : getCollectionCount(badge.category);
    return {
      ...badge,
      unlocked: count >= badge.requirement,
    };
  });

  return (
    <CollectionContext.Provider
      value={{
        collectedItems,
        badges,
        addToCollection,
        removeFromCollection,
        isCollected,
        getCollectionCount,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
};

export const useCollection = () => {
  const context = useContext(CollectionContext);
  if (context === undefined) {
    throw new Error("useCollection must be used within a CollectionProvider");
  }
  return context;
};
