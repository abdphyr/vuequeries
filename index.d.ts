import { AxiosInstance, RawAxiosRequestConfig } from "axios";
import { Ref, ComputedRef } from "vue";

export declare function defineApiResource<O, A = O>(options: ResourceOptions): ApiResource<O, A>;
export declare function defineApiResource<O, A = O>(url: string, tokenKey?: string, expiresIn?: number): ApiResource<O, A>;

export declare function defineVuexResource<O, A = O>(options: ResourceOptions): VuexResource<O, A>;
export declare function defineVuexResource<O, A = O>(url: string, tokenKey?: string, expiresIn?: number): VuexResource<O, A>;

export declare function defineGetRequest<T>(options: GetReqOpts): GetRequest<T>;
export declare function defineGetRequest<T>(url: string, tokenKey?: string, expiresIn?: number): GetRequest<T>;

export declare function definePostRequest<T>(options: PostReqOpts): PostRequest<T>;
export declare function definePostRequest<T>(url: string, tokenKey?: string): PostRequest<T>;

export declare function definePutRequest<T>(options: PutReqOpts): PutRequest<T>;
export declare function definePutRequest<T>(url: string, tokenKey?: string): PutRequest<T>;

export declare function definePatchRequest<T>(options: PatchReqOpts): PatchRequest<T>;
export declare function definePatchRequest<T>(url: string, tokenKey?: string): PatchRequest<T>;

export declare function defineDeleteRequest<T>(options: DeleteReqOpts): DeleteRequest<T>;
export declare function defineDeleteRequest<T>(url: string, tokenKey?: string): DeleteRequest<T>;

export declare function defineModifRequest<T, Dto = undefined>(options: ModifReqOpts, config?: RawAxiosRequestConfig): ModifRequest<T, Dto>;
export declare function defineModifRequest<T, Dto = undefined>(url: string, method: Methods, tokenKey?: string, config?: RawAxiosRequestConfig): ModifRequest<T, Dto>;

export declare function useModif<T, Dto = undefined>(options: ModifReqOpts, config?: RawAxiosRequestConfig): ModifRequest<T, Dto>;
export declare function useModif<T, Dto = undefined>(url: string, method: Methods, tokenKey?: string, config?: RawAxiosRequestConfig): ModifRequest<T, Dto>;


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

export type QueryParams = {
  [key: string]: string | number;
};

///////////////////////// USE MODIF /////////////////////////

type Methods = "post" | "put" | "delete" | "patch";

/**
 * MODIFICATION OPTIONS
 */
type ModifReqOpts = {
  /**
   * Request `url`
   */
  url: string;

  /**
  * Get token from localStorage with this `tokenKey`
  */
  tokenKey?: string;

  /**
   * Http method
   */
  method: Methods;
}

/**
 * MODIFICATION FUNCTION RETURNERS
 */
type ModifRequest<T, Dto> = Dto extends undefined ?
  IModifRequest<T> & { modif: (options?: IModifOptions<T>) => void } :
  IModifRequest<T> & { modif: (data: Dto, options?: IModifOptions<T>) => void; };


interface IModifRequest<T> {
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

//////////////////// RESOURCE /////////////////////////

/**
 * API RESOURCE STATE
 */
type ApiResourceState<O, A> = {
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
type ResourceOptions = {

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

////////////////////  VUEX RESOURCE ///////////////////////////////
////////////////////  VUEX RESOURCE ///////////////////////////////
////////////////////  VUEX RESOURCE ///////////////////////////////
////////////////////  VUEX RESOURCE ///////////////////////////////


type VuexResourceState<O, A> = {
  isLng: boolean;
  isErr: boolean;
  err: IError;
  all: A;
  one: O | null;
  mutitem: O | null;
};

/**
 *  VUEX RESOURCE INTERFACE
 */
interface VuexResource<O, A> {
  /**
   * vuex resource state
   */

  cleanState: VuexResourceState<O, A>;

  /**
   * @returns ` data, isLng, err, isErr, all, one, mutitem` 
   */
  getAllMutation(state: VuexResourceState<O, A>): VuexResourceState<O, A>;

  /**
  * @returns ` data, isLng, err, isErr, all, one, mutitem` 
  */
  getAllMutation(state: VuexResourceState<O, A>, options: { params?: string | QueryParams, config?: RawAxiosRequestConfig }): VuexResourceState<O, A>;

  /**
 * @returns ` data, isLng, err, isErr, all, one, mutitem` 
 */
  getOneMutation(state: VuexResourceState<O, A>, options: { param: number | string, config?: RawAxiosRequestConfig }): VuexResourceState<O, A>;

  /**
   * For `post` request.
   * @returns ` data, isLng, err, isErr, all, one, mutitem` 
   */
  createMutation<Dto>(state: VuexResourceState<O, A>, options: { config?: RawAxiosRequestConfig, data: Dto, options?: IModifOptions<O> }): VuexResourceState<O, A>;

  /**
   * For `put` request.
   * @returns ` data, isLng, err, isErr, all, one, mutitem` 
   */
  updateMutation<Dto>(state: VuexResourceState<O, A>, options: { param: number | string, data: Dto, config?: RawAxiosRequestConfig, options?: IModifOptions<O> }): VuexResourceState<O, A>;


  /**
   * For `patch` request.
   * @returns ` data, isLng, err, isErr, all, one, mutitem` 
   */
  patchMutation<Dto>(state: VuexResourceState<O, A>, options: { param: number | string, data: Dto, config?: RawAxiosRequestConfig, options?: IModifOptions<O> }): VuexResourceState<O, A>;


  /**
  * For `patch` request.
  * @returns ` data, isLng, err, isErr, all, one, mutitem` 
  */
  deleteMutation(state: VuexResourceState<O, A>, options: { param: number | string, config?: RawAxiosRequestConfig, options?: IModifOptions<O> }): VuexResourceState<O, A>;

}


////////////////////  API RESOURCE ///////////////////////////////
////////////////////  API RESOURCE ///////////////////////////////
////////////////////  API RESOURCE ///////////////////////////////
////////////////////  API RESOURCE ///////////////////////////////

/**
 *  API RESOURCE INTERFACE
 */
interface ApiResource<O, A> {
  /**
   * Api resource state
   */
  state: ApiResourceState<O, A>;

  /**
   * Computed state
   */
  computedState: ApiResourceState<O, A>;

  /**
   * Get all items 
   * @returns ` data, isLng, err, isErr ` 
   */
  getAll(): ApiResReturnersAll<A>;

  /**
   * Get all items 
   * @param params as {`key`: `value`} or `page=1&limit=10`
   * @returns ` data, isLng, err, isErr ` 
   */
  getAll(params?: QueryParams, config?: RawAxiosRequestConfig): ApiResReturnersAll<A>

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
   * @param param `number` or `string`
   * @returns ` data, isLng, err, isErr ` and `modif` function for running `delete` request
   */
  delete(param: number | string, config?: RawAxiosRequestConfig): {
    /**
     * @param options `onSuccess` and `onError` functions running that request status
     */
    modif: (options?: IModifOptions<O>) => void;
  } & ApiResReturnersOne<O>
}


////////////////////  REQUESTS ///////////////////////////////
////////////////////  REQUESTS ///////////////////////////////
////////////////////  REQUESTS ///////////////////////////////
////////////////////  REQUESTS ///////////////////////////////

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

type GetReqOpts = {

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
type PostReqOpts = RequestOptions
type PutReqOpts = RequestOptions
type PatchReqOpts = RequestOptions
type DeleteReqOpts = RequestOptions

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

type CleanState<T> = {
  isLng: boolean;
  isErr: boolean;
  err: IError;
  data: T
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
   * Clean state
   */
  cleanState: CleanState<T>;
  /**
   * Computed state
   */
  computedState: RequestState<T>;
}

/**
 * GET REQUEST
 */
interface GetRequest<T> extends Request<T> {
  /**
   * Run `get` request
   * @param param `number` or `string` or {`key`: `value`} or `page=1&limit=10`
   * @returns ` data, isLng, err, isErr `
   */
  get(param?: number | string | QueryParams, config?: RawAxiosRequestConfig): RequestReturners<T>;
  /**
   * Run `get` request
   * @param state  vuex state
   * @param options 
   */
  getMutation(state: CleanState<T>, options?: { param?: number | string | QueryParams, config?: RawAxiosRequestConfig }): CleanState<T>;
}

/**
 * POST REQUEST
 */
interface PostRequest<T> extends Request<T> {
  /**
   * Run `post` request
   * @returns ` data, isLng, err, isErr ` and `modif` function for running `post` request
   */
  post<Dto>(config?: RawAxiosRequestConfig): RequestReturners<T> & {

    /**
    * @param data `DTO data transfer object`,
    * @param options `onSuccess` and `onError` functions running that request status
    */
    modif: (data: Dto, options?: IModifOptions<T>) => void;
  }

  /**
   * For `post` request.
   * @returns ` data, isLng, err, isErr, data` 
   */
  postMutation<Dto>(state: CleanState<T>, options: { data: Dto, config?: RawAxiosRequestConfig, options?: IModifOptions<T> }): CleanState<T>;
}

/**
 * PUT REQUEST
 */
interface PutRequest<T> extends Request<T> {
  /**
   * @param param `number` or `string`
   * @returns ` data, isLng, err, isErr ` and `modif` function for running `put` request
   */
  put<Dto>(param: number | string, config?: RawAxiosRequestConfig): RequestReturners<T> & {

    /**
     * @param data `DTO data transfer object`,
     * @param options `onSuccess` and `onError` functions running that request status
     */
    modif: (data: Dto, options?: IModifOptions<T>) => void;
  }

  /**
   * For `put` request.
   * @returns ` data, isLng, err, isErr, data` 
   */
  putMutation<Dto>(state: CleanState<T>, options: { param: number | string, data: Dto, config?: RawAxiosRequestConfig, options?: IModifOptions<T> }): CleanState<T>;
}

/**
 * PATCH REQUEST
 */
interface PatchRequest<T> extends Request<T> {
  /**
   * @param param `number` or `string`
   * @returns ` data, isLng, err, isErr ` and `modif` function for running `patch` request
   */
  patch<Dto>(param: number | string, config?: RawAxiosRequestConfig): RequestReturners<T> & {

    /**
     * @param data `DTO data transfer object`,
     * @param options `onSuccess` and `onError` functions running that request status
     */
    modif: (data: Dto, options?: IModifOptions<T>) => void;
  }

  /**
   * For `putch` request.
   * @returns ` data, isLng, err, isErr, data` 
   */
  patchMutation<Dto>(state: CleanState<T>, options: { param: number | string, data: Dto, config?: RawAxiosRequestConfig, options?: IModifOptions<T> }): CleanState<T>;
}


/**
 * DELETE REQUEST
 */
interface DeleteRequest<T> extends Request<T> {
  /**
   * @param param `number` or `string`
   * @returns ` data, isLng, err, isErr ` and `modif` function for running `delete` request
   */
  delete(param: number | string, config?: RawAxiosRequestConfig): RequestReturners<T> & {

    /**
     * @param options `onSuccess` and `onError` functions running that request status
     */
    modif: (options?: IModifOptions<T>) => void;
  }

  /**
   * For `delete` request.
   * @returns ` data, isLng, err, isErr, data` 
   */
  deleteMutation(state: CleanState<T>, options: { param: number | string, config?: RawAxiosRequestConfig, options?: IModifOptions<T> }): CleanState<T>;
}

export { }
