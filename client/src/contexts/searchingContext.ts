import { createContext } from "react";

export type searchContextType = {
  searching: boolean;
  setSearching: React.Dispatch<React.SetStateAction<boolean>>;
};

export const searchingContext = createContext<searchContextType>({
  searching: false,
  setSearching: () => {},
});
