import Emitter from "../socket/emitters/Emitters";

export function searchButtonHandler(
  name: string,
  setSearching: (value: boolean) => any,
): void {
  const emitter = Emitter.getInstance();
  setSearching(true);
  emitter.search(name);
}
