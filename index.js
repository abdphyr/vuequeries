import { useModification } from "./src/mutation";


export const defineModifRequest = (options, method, tokenKey) => useModification(options, method, tokenKey);
export const useModif = (options, method, tokenKey) => useModification(options, method, tokenKey);