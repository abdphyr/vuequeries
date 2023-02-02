import { PiniaGet, PiniaPost, PiniaDelete, PiniaPatch, PiniaPut } from "./src/pinia/requests";
import { PiniaResource } from "./src/pinia/resource";

export const defApiPinia = (options, tokenKey, expiresIn) => new PiniaResource(options, tokenKey, expiresIn);
export const defGetPinia = (options, tokenKey, expiresIn) => new PiniaGet(options, tokenKey, expiresIn);
export const defPostPinia = (options, tokenKey) => new PiniaPost(options, tokenKey);
export const defPutPinia = (options, tokenKey) => new PiniaPut(options, tokenKey);
export const defPatchPinia = (options, tokenKey) => new PiniaPatch(options, tokenKey);
export const defDeletePinia = (options, tokenKey) => new PiniaDelete(options, tokenKey);