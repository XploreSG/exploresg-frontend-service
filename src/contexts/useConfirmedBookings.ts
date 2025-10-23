import { useContext } from "react";
import ConfirmedBookingsContext from "./ConfirmedBookingsContext";

export const useConfirmedBookings = () => {
  const context = useContext(ConfirmedBookingsContext);
  if (!context) {
    throw new Error(
      "useConfirmedBookings must be used within a ConfirmedBookingsProvider",
    );
  }
  return context;
};
