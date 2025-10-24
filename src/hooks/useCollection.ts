import { useContext } from "react";
import { CollectionContext } from "../contexts/CollectionContext.ts";

export const useCollection = () => {
  const context = useContext(CollectionContext);
  if (context === undefined) {
    throw new Error("useCollection must be used within a CollectionProvider");
  }
  return context;
};
