import { RawAxiosRequestConfig } from "axios";
import { Commit } from 'vuex';

export declare function defApiVuex<O, A = O>(options: ApiVuexOptions): ApiVuex<O, A>;
export declare function defApiVuex<O, A = O>(url: string, tokenKey?: string, expiresIn?: number): ApiVuex<O, A>;

export declare function defGetVuex<T>(options: GetVuexOpts): GetVuex<T>;
export declare function defGetVuex<T>(url: string, tokenKey?: string, expiresIn?: number): GetVuex<T>;

export declare function defPostVuex<T>(options: PostVuexOpts): PostVuex<T>;
export declare function defPostVuex<T>(url: string, tokenKey?: string): PostVuex<T>;

export declare function defPutVuex<T>(options: PutVuexOpts): PutVuex<T>;
export declare function defPutVuex<T>(url: string, tokenKey?: string): PutVuex<T>;

export declare function defPatchVuex<T>(options: PatchVuexOpts): PatchVuex<T>;
export declare function defPatchVuex<T>(url: string, tokenKey?: string): PatchVuex<T>;

export declare function defDeleteVuex<T>(options: DeleteVuexOpts): DeleteVuex<T>;
export declare function defDeleteVuex<T>(url: string, tokenKey?: string): DeleteVuex<T>;


/**
 * ERROR TYPE
 */
export type IError = {
  error: {
    [key: string]: string[]
  } | string;
  message: {
    [key: string]: string[]
  } | string;
}

/**
 * MODIFICATION OPTIONS
 */
interface IModifOptions<O> {
  /**
   * Run this function when `modif` function is successfully
   * @param data response `data`
   * @returns void
   */
  onSuccess?: (data: O) => void,

  /**
   * Run this function when `modif` function is failed
   * @param err response `error`
   * @returns void
   */
  onError?: (err: IError) => void
}

//////////////////// RESOURCE /////////////////////////

/**
 * API RESOURCE STATE
 */
type ApiVuexState<O, A> = {
  /**
   * `isLoading` state
   */
  isLng: boolean;

  /**
   * `isError` state
   */
  isErr: boolean;

  /**
   * `error` state
   */
  err: IError;

  /**
   * `all` state
   */
  all: A;

  /**
   * `one` state
   */
  one: O | null;

  /**
   * `mutitem` state
   */
  mutitem: O | null;
}


/**
 * API RESORCE OPTIONS
 */
type ApiVuexOptions = {

  /**
   * Api resource request `url`
   */
  url: string;

  /**
   * State expires in `expiresIn` minutes. Default 10 minutes
   */
  expiresIn?: number;

  /**
   * Get token from localStorage with this `tokenKey`
   */
  tokenKey?: string;
}


/**
 *  API RESOURCE INTERFACE
 */
interface ApiVuex<O, A> {
  /**
   * Api resource state
   */
  state: ApiVuexState<O, A>;

  /**
   * Mutation name
   */
  MUTNAME: string;

  /**
   * Get all items 
   * @returns ` data, isLng, err, isErr ` 
   */
  getAll(commit: Commit, options?: { params?: QueryParams | string, config?: RawAxiosRequestConfig }): void;

  /**
   * Get one item 
   */
  getOne(commit: Commit, options: { param: number | string, config?: RawAxiosRequestConfig }): void;

  /**
   * For `post` request.
   */
  create<Dto>(commit: Commit, options: { data: Dto, config?: RawAxiosRequestConfig, options?: IModifOptions<O> }): void;

  /**
   * For `put` request.
   */
  update<Dto>(commit: Commit, options: { data: Dto, param: number | string, config?: RawAxiosRequestConfig, options?: IModifOptions<O> }): void;

  /**
   * For `patch` request.
   */
  patch<Dto>(commit: Commit, options: { data: Dto, param: number | string, config?: RawAxiosRequestConfig, options?: IModifOptions<O> }): void;

  /**
   * For `delete` request.
   */
  delete(commit: Commit, options: { param: number | string, config?: RawAxiosRequestConfig, options?: IModifOptions<O> }): void;
}

///////////////////////////////// REQUESTS ///////////////////////////////////

/**
 * REQUEST OPTIONS
 */
type RequestOptions = {

  /**
   * Request `url`
   */
  url: string;

  /**
  * Get token from localStorage with this `tokenKey`
  */
  tokenKey?: string;
}

type GetVuexOpts = {

  /**
   * Request `url`
   */
  url: string;

  /**
  * State expires in `expiresIn` minutes. Default 10 minutes
  */
  expiresIn?: number

  /**
  * Get token from localStorage with this `tokenKey`
  */
  tokenKey?: string;
}
type PostVuexOpts = RequestOptions
type PutVuexOpts = RequestOptions
type PatchVuexOpts = RequestOptions
type DeleteVuexOpts = RequestOptions

/**
 * REQUEST STATE
 */
type RequestState<T> = {
  /**
   * `isLoading` state
   */
  isLng: boolean;

  /**
   * `isError` state
   */
  isErr: boolean;

  /**
   * `error` state
   */
  err: IError;

  /**
   * `data` state
   */
  data: T;
}


/**
 * REQUEST
 */
interface Request<T> {

  /**
   * Get request `state`
   */
  state: RequestState<T>;

  /**
   * Mutation name
   */
  MUTNAME: string;
}

/**
 * GET REQUEST
 */
interface GetVuex<T> extends Request<T> {
  /**
   * Run `get` request
   */
  action(commit: Commit, options?: { param?: QueryParams | string | number, config?: RawAxiosRequestConfig }): void;
}

/**
 * POST REQUEST
 */
interface PostVuex<T> extends Request<T> {
  /**
   * Run `post` request
   */
  action<Dto>(commit: Commit, options: { data: Dto, config?: RawAxiosRequestConfig, options?: IModifOptions<T> }): void;
}

/**
 * PUT REQUEST
 */
interface PutVuex<T> extends Request<T> {
  /**
   *Run `put` request
   */
  action<Dto>(commit: Commit, options: { data: Dto, param: number | string, config?: RawAxiosRequestConfig, options?: IModifOptions<T> }): void;
}

/**
 * PATCH REQUEST
 */
interface PatchVuex<T> extends Request<T> {
  /**
 *Run `patch` request
 */
  action<Dto>(commit: Commit, options: { data: Dto, param: number | string, config?: RawAxiosRequestConfig, options?: IModifOptions<T> }): void;
}


/**
 * DELETE REQUEST
 */
interface DeleteVuex<T> extends Request<T> {
  /**
 *Run `delete` request
 */
  action(commit: Commit, options: { param: number | string, config?: RawAxiosRequestConfig, options?: IModifOptions<T> }): void;
}
