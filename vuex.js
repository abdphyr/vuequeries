import { VuexGet, VuexPost, VuexPut, VuexPatch, VuexDelete } from "./src/vuex/requests";
import { VuexResouce } from "./src/vuex/resource";

export const defApiVuex = (options, tokenKey, expiresIn) => new VuexResouce(options, tokenKey, expiresIn);
export const defGetVuex = (options, tokenKey, expiresIn) => new VuexGet(options, tokenKey, expiresIn);
export const defPostVuex = (options, tokenKey) => new VuexPost(options, tokenKey);
export const defPutVuex = (options, tokenKey) => new VuexPut(options, tokenKey);
export const defPatchVuex = (options, tokenKey) => new VuexPatch(options, tokenKey);
export const defDeleteVuex = (options, tokenKey) => new VuexDelete(options, tokenKey);