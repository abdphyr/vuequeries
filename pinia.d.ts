import { RawAxiosRequestConfig } from "axios";
import { Ref, ComputedRef } from "vue";

export declare function defApiPinia<O, A = O>(options: ApiPiniaOptions): ApiPinia<O, A>;
export declare function defApiPinia<O, A = O>(url: string, tokenKey?: string, expiresIn?: number): ApiPinia<O, A>;

export declare function defGetPinia<T>(options: GetPiniaOpts): GetPinia<T>;
export declare function defGetPinia<T>(url: string, tokenKey?: string, expiresIn?: number): GetPinia<T>;

export declare function defPostPinia<T>(options: PostPiniaOpts): PostPinia<T>;
export declare function defPostPinia<T>(url: string, tokenKey?: string): PostPinia<T>;

export declare function defPutPinia<T>(options: PutPiniaOpts): PutPinia<T>;
export declare function defPutPinia<T>(url: string, tokenKey?: string): PutPinia<T>;

export declare function defPatchPinia<T>(options: PatchPiniaOpts): PatchPinia<T>;
export declare function defPatchPinia<T>(url: string, tokenKey?: string): PatchPinia<T>;

export declare function defDeletePinia<T>(options: DeletePiniaOpts): DeletePinia<T>;
export declare function defDeletePinia<T>(url: string, tokenKey?: string): DeletePinia<T>;


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
 * QueryParams
 */
export type QueryParams = {
  [key: string]: string | number;
};

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
type ApiPiniaState<O, A> = {
  /**
   * `isLoading` state
   */
  isLng: Ref<boolean>;

  /**
   * `isError` state
   */
  isErr: Ref<boolean>;

  /**
   * `error` state
   */
  err: Ref<IError>;

  /**
   * `all` state
   */
  all: Ref<A>;

  /**
   * `one` state
   */
  one: Ref<O | null>;

  /**
   * `mutitem` state
   */
  mutitem: Ref<O | null>;
}

/**
 * API RESOURCE RETURNERS ONE
 */
type ApiResReturnersOne<O> = {
  /**
   * `isLoading` resource request result
   */
  isLng: ComputedRef<boolean>;

  /**
 * `isError` resource request result
 */
  isErr: ComputedRef<boolean>;

  /**
  * `error` resource request result
  */
  err: ComputedRef<IError>;

  /**
   * `data` resource request result
   */
  data: ComputedRef<O | null>;
}

/**
 * API RESOURCE RETURNERS ALL
 */
type ApiResReturnersAll<A> = {
  /**
   * `isLoading` resource request result
   */
  isLng: ComputedRef<boolean>;

  /**
 * `isError` resource request result
 */
  isErr: ComputedRef<boolean>;

  /**
  * `error` resource request result
  */
  err: ComputedRef<IError>;

  /**
   * `data` resource request result
   */
  data: ComputedRef<A>;
}

/**
 * API RESORCE OPTIONS
 */
type ApiPiniaOptions = {

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
interface ApiPinia<O, A> {
  /**
   * Api resource state
   */
  state: ApiPiniaState<O, A>;

  /**
   * Computed state
   */
  computedState: ApiPiniaState<O, A>;

  /**
   * Get all items 
   * @param params as {`key`: `value`} or `page=1&limit=10`
   * @returns ` data, isLng, err, isErr ` 
   */
  getAll(params?: QueryParams | string, config?: RawAxiosRequestConfig): ApiResReturnersAll<A>

  /**
   * Get one item
   * @param param `number` or `string`
   * @returns ` data, isLng, err, isErr ` 
   */
  getOne(param: number | string, config?: RawAxiosRequestConfig): ApiResReturnersOne<O>

  /**
   * For `post` request.
   * @returns ` data, isLng, err, isErr ` and `modif` function for running `post` request
   */
  create<Dto>(config?: RawAxiosRequestConfig): {

    /**
     * @param data `DTO data transfer object`,
     * @param options `onSuccess` and `onError` functions running that request status
     */
    modif: (data: Dto, options?: IModifOptions<O>) => void;
  } & ApiResReturnersOne<O>

  /**
   * For `put` request.
   * @param param `number` or `string` 
   * @returns ` data, isLng, err, isErr ` and `modif` function for running `put` request
   */
  update<Dto>(param: number | string, config?: RawAxiosRequestConfig): {
    /**
     * @param data `DTO data transfer object`,
     * @param options `onSuccess` and `onError` functions running that request status
     */
    modif: (data: Dto, options?: IModifOptions<O>) => void;
  } & ApiResReturnersOne<O>;

  /**
   * For `patch` request.
   * @param param `number` or `string` 
   * @returns ` data, isLng, err, isErr ` and `modif` function for running `patch` request
   */
  patch<Dto>(param: number | string, config?: RawAxiosRequestConfig): {
    /**
     * @param data `DTO data transfer object`,
     * @param options `onSuccess` and `onError` functions running that request status
     */
    modif: (data: Dto, options?: IModifOptions<O>) => void;
  } & ApiResReturnersOne<O>;

  /**
   * For `delete` request.
   * @param param `number` or `string`///////////////////////////////////////////////////////////////////////
   * @returns ` data, isLng, err, isErr ` and `modif` function for running `delete` request
   */
  delete(param: number | string, config?: RawAxiosRequestConfig): {
    /**
     * @param options `onSuccess` and `onError` functions running that request status
     */
    modif: (options?: IModifOptions<O>) => void;
  } & ApiResReturnersOne<O>
}


//////////////////////////////////////// REQUESTS /////////////////////////////////////

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

type GetPiniaOpts = {

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
type PostPiniaOpts = RequestOptions
type PutPiniaOpts = RequestOptions
type PatchPiniaOpts = RequestOptions
type DeletePiniaOpts = RequestOptions

/**
 * REQUEST STATE
 */
type RequestState<T> = {
  /**
   * `isLoading` state
   */
  isLng: Ref<boolean>;

  /**
   * `isError` state
   */
  isErr: Ref<boolean>;

  /**
   * `error` state
   */
  err: Ref<IError>;

  /**
   * `data` state
   */
  data: Ref<T>;
}


/**
 * REQUEST RETURNERS
 */
type RequestReturners<T> = {

  /**
   * `isLoading` request result
   */
  isLng: ComputedRef<boolean>;

  /**
 * `isError` request result
 */
  isErr: ComputedRef<boolean>;

  /**
  * `error` request result
  */
  err: ComputedRef<IError>;

  /**
   * `data` request result
   */
  data: ComputedRef<T>;
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
   * Computed state
   */
  computedState: RequestState<T>;
}

/**
 * GET REQUEST
 */
interface GetPinia<T> extends Request<T> {
  /**
   * Run `get` request
   * @param param `number` or `string` or {`key`: `value`} or `page=1&limit=10`
   * @returns ` data, isLng, err, isErr `
   */
  action(param?: number | string | QueryParams, config?: RawAxiosRequestConfig): RequestReturners<T>;
}

/**
 * POST REQUEST
 */
interface PostPinia<T> extends Request<T> {
  /**
   * Run `post` request
   * @returns ` data, isLng, err, isErr ` and `modif` function for running `post` request
   */
  action<Dto>(config?: RawAxiosRequestConfig): RequestReturners<T> & {

    /**
    * @param data `DTO data transfer object`,
    * @param options `onSuccess` and `onError` functions running that request status
    */
    modif: (data: Dto, options?: IModifOptions<T>) => void;
  }
}

/**
 * PUT REQUEST
 */
interface PutPinia<T> extends Request<T> {
  /**
   * @param param `number` or `string`
   * @returns ` data, isLng, err, isErr ` and `modif` function for running `put` request
   */
  action<Dto>(param: number | string, config?: RawAxiosRequestConfig): RequestReturners<T> & {

    /**
     * @param data `DTO data transfer object`,
     * @param options `onSuccess` and `onError` functions running that request status
     */
    modif: (data: Dto, options?: IModifOptions<T>) => void;
  }
}

/**
 * PATCH REQUEST
 */
interface PatchPinia<T> extends Request<T> {
  /**
   * @param param `number` or `string`
   * @returns ` data, isLng, err, isErr ` and `modif` function for running `patch` request
   */
  action<Dto>(param: number | string, config?: RawAxiosRequestConfig): RequestReturners<T> & {

    /**
     * @param data `DTO data transfer object`,
     * @param options `onSuccess` and `onError` functions running that request status
     */
    modif: (data: Dto, options?: IModifOptions<T>) => void;
  }
}


/**
 * DELETE REQUEST
 */
interface DeletePinia<T> extends Request<T> {
  /**
   * @param param `number` or `string`
   * @returns ` data, isLng, err, isErr ` and `modif` function for running `delete` request
   */
  action(param: number | string, config?: RawAxiosRequestConfig): RequestReturners<T> & {

    /**
     * @param options `onSuccess` and `onError` functions running that request status
     */
    modif: (options?: IModifOptions<T>) => void;
  }
}
