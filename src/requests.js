import { ref, computed } from "vue";
import { runner } from "./axios";

class Request {
  state;
  url;
  computedState;
  cleanState;
  constructor(options, tokenKey) {
    this.url = typeof options === "string" ? options : options.url;
    this.state = {
      isLng: ref(true),
      isErr: ref(false),
      err: ref({}),
      data: ref({})
    }
    this.runner = runner(tokenKey ?? options.tokenKey);
    this.computedState = computed(() => this.state);
    this.cleanState = {
      isLng: true,
      isErr: false,
      err: {},
      data: {}
    }
  }
  _setCleanState({ isLng, isErr, err, data }) {
    this.cleanState.isLng = isLng ?? this.cleanState.isLng;
    this.cleanState.isErr = isErr ?? this.cleanState.isErr;
    this.cleanState.err = err ?? this.cleanState.err;
    this.cleanState.data = data ?? this.cleanState.data;
  }

  _setError(error) {
    this.state.err.value = error;
    this.state.isErr.value = true;
    this.state.isLng.value = false;
    this.state.data.value = {};
    this._setCleanState({ err: error, isErr: true, isLng: false, data: {} });
  }

  _setData(data) {
    this.state.data.value = data;
    this.state.isLng.value = false;
    this._setCleanState({ data: data, isLng: false });
  }

  _setLoad() {
    this.state.isLng.value = true;
    this.state.err.value = {};
    this.state.isErr.value = false;
    this._setCleanState({ isLng: true, err: {}, isErr: false });
  }

  _returner(modif) {
    return {
      modif,
      data: computed(() => this.state.data.value),
      isLng: computed(() => this.state.isLng.value),
      isErr: computed(() => this.state.isErr.value),
      err: computed(() => this.state.err.value)
    }
  }

  _setStateLoad(state) {
    state['isLng'] = true;
    state['isErr'] = false;
    state['err'] = {};
  }

  _setStateData(state, data) {
    state['data'] = data;
    state['isLng'] = false;
  }

  _setStateError(state, error) {
    state['err'] = error
    state['isErr'] = true;
    state['isLng'] = false;
  }
}

export class GetRequest extends Request {
  #expiresIn;
  #whenGet;
  #getAllParams;
  constructor(options, tokenKey, expiresIn) {
    super(options, tokenKey);
    this.#expiresIn = expiresIn ?? options.expiresIn ?? 10;
    this.#whenGet = 0;
    this.#getAllParams = {};
  }

  _urlWithParams(params) {
    let urlWithParams = this.url;
    if (typeof params === "object") {
      const paramsKeys = Object.keys(params);
      for (let key of paramsKeys) {
        if (params[key] !== this.#getAllParams[key]) {
          this.#whenGet = 0;
          this.#getAllParams = params;
          break;
        }
      }
      urlWithParams += "?";
      for (let i = 0; i < paramsKeys.length; i++) {
        if (i === paramsKeys.length - 1) {
          urlWithParams += `${paramsKeys[i]}=${params[paramsKeys[i]]}`
        } else {
          urlWithParams += `${paramsKeys[i]}=${params[paramsKeys[i]]}&`
        }
      }
    }
    if (typeof params === "string" && (params.includes("=") || params.includes("&"))) {
      const paramsArr = params.split("&");
      for (let i = 0; i < paramsArr.length; i++) {
        let item = paramsArr[i].split("=");
        if (this.#getAllParams[item[0]] !== item[1]) {
          this.#whenGet = 0;
          break;
        }
      }
      for (let i = 0; i < paramsArr.length; i++) {
        let item = paramsArr[i].split("=");
        this.#getAllParams[item[0]] = item[1];
      }
      urlWithParams += "?" + params;
    }
    if (typeof params === "string" || typeof params === "number") {
      urlWithParams += params;
    }
    return urlWithParams;
  }

  get(param, config) {
    let path = this._urlWithParams(param)
    if ((Date.now() - this.#whenGet) > (this.#expiresIn * 60000)) {
      this._setLoad();
      this.runner.get(path, config)
        .then((res) => {
          this.#whenGet = Date.now();
          this._setData(res.data)
        })
        .catch((error) => {
          this._setError(error.response.data);
        })
    }
    return this._returner();
  }

  getMutation(state, options) {
    let path = this._urlWithParams(options.param)
    if ((Date.now() - this.#whenGet) > (this.#expiresIn * 60000)) {
      this._setLoad();
      this._setStateLoad(state);
      this.runner.get(path, options.config)
        .then((res) => {
          this.#whenGet = Date.now();
          this._setData(res.data);
          this._setStateData(state, res.data);
        })
        .catch((error) => {
          this._setError(error.response.data);
          this._setStateError(state, error.response.error);
        })
    }
    return this.cleanState;
  }
}

export class PostRequest extends Request {
  post(config) {
    this.state.isLng.value = false;
    const modif = (data, options) => {
      this._setLoad();
      this.runner.post(this.url, data, config)
        .then((res) => {
          this._setData(res.data);
          options?.onSuccess && options.onSuccess(res.data);
        })
        .catch((error) => {
          this._setError(error.response.data);
          options?.onError && options.onError(error.response.data);
        })
    }
    return this._returner(modif);
  }

  postMutation(state, { config, data, options }) {
    this._setLoad();
    this._setStateLoad(state);
    this.runner.post(this.url, data, config)
      .then((res) => {
        this._setData(res.data);
        this._setStateData(state, res.data);
        options?.onSuccess && options.onSuccess(res.data);
      })
      .catch((error) => {
        this._setError(error.response.data);
        this._setStateError(state, error.response.error);
        options?.onError && options.onError(error.response.data);
      })
    return this.cleanState;
  }
}

export class PutRequest extends Request {
  put(param, config) {
    this.state.isLng.value = false;
    const modif = (data, options) => {
      this._setLoad();
      this.runner.put(this.url + "/" + param, data, config)
        .then((res) => {
          this._setData(res.data);
          options?.onSuccess && options.onSuccess(res.data);
        })
        .catch((error) => {
          this._setError(error.response.data);
          options?.onError && options.onError(error.response.data);
        })
    }
    return this._returner(modif);
  }

  putMutation(state, { param, config, data, options }) {
    this._setLoad();
    this._setStateLoad(state);
    this.runner.put(this.url + "/" + param, data, config)
      .then((res) => {
        this._setData(res.data);
        this._setStateData(state, res.data);
        options?.onSuccess && options.onSuccess(res.data);
      })
      .catch((error) => {
        this._setError(error.response.data);
        this._setStateError(state, error.response.error);
        options?.onError && options.onError(error.response.data);
      })
    return this.cleanState;
  }
}

export class PatchRequest extends Request {
  patch(param, config) {
    this.state.isLng.value = false;
    const modif = (data, options) => {
      this._setLoad();
      this.runner.patch(this.url + "/" + param, data, config)
        .then((res) => {
          this._setData(res.data);
          options?.onSuccess && options.onSuccess(res.data);
        })
        .catch((error) => {
          this._setError(error.response.data);
          options?.onError && options.onError(error.response.data);
        })
    }
    return this._returner(modif);
  }

  patchMutation(state, { param, config, data, options }) {
    this._setLoad();
    this._setStateLoad(state);
    this.runner.patch(this.url + "/" + param, data, config)
      .then((res) => {
        this._setData(res.data);
        this._setStateData(state, res.data);
        options?.onSuccess && options.onSuccess(res.data);
      })
      .catch((error) => {
        this._setError(error.response.data);
        this._setStateError(state, error.response.error);
        options?.onError && options.onError(error.response.data);
      })
    return this.cleanState;
  }
}

export class DeleteRequest extends Request {
  delete(param, config) {
    this.state.isLng.value = false;
    const modif = (options) => {
      this._setLoad();
      this.runner.delete(this.url + "/" + param, config)
        .then((res) => {
          this._setData(res.data);
          options?.onSuccess && options.onSuccess(res.data);
        })
        .catch((error) => {
          this._setError(error.response.data);
          options?.onError && options.onError(error.response.data);
        })
    }
    return this._returner(modif);
  }

  deleteMutation(state, { param, config, options }) {
    this._setLoad();
    this._setStateLoad(state);
    this.runner.delete(this.url + "/" + param, config)
      .then((res) => {
        this._setData(res.data);
        this._setStateData(state, res.data);
        options?.onSuccess && options.onSuccess(res.data);
      })
      .catch((error) => {
        this._setError(error.response.data);
        this._setStateError(state, error.response.error);
        options?.onError && options.onError(error.response.data);
      })
    return this.cleanState;
  }
}
