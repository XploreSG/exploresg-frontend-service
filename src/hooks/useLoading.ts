import { useContext } from "react";
import LoadingContext from "../contexts/LoadingContext";

export const useLoading = () => useContext(LoadingContext);

export default useLoading;
