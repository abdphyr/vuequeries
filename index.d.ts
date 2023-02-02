import { RawAxiosRequestConfig } from "axios";
import { ComputedRef } from "vue";

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
