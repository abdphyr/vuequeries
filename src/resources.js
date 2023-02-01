import { ref, computed } from "vue";
import { runner } from "./axios";

class Resource {
  state;
  computedState;
  cleanState;
  params;
  url;
  expiresIn;
  whenAllGet;
  whenOneGet;
  getAllReqParams;
  constructor(options, tokenKey, expiresIn) {
    this.url = typeof options === "string" ? options : options.url;
    this.expiresIn = expiresIn ?? options.expiresIn ?? 10;
    this.whenOneGet = 0;
    this.whenAllGet = 0;
    this.getAllReqParams = {};
    this.state = {
      isLng: ref(true),
      isErr: ref(false),
      err: ref({}),
      all: ref({}),
      one: ref(null),
      mutitem: ref(null),
    }
    this.runner = runner(tokenKey ?? options.tokenKey);
    this.computedState = computed(() => this.state);
    this.cleanState = {
      isLng: true,
      isErr: false,
      err: {},
      all: {},
      one: null,
      mutitem: null,
    }
  }

  _setCleanState({ isLng, isErr, err, all, one, mutitem }) {
    this.cleanState.isLng = isLng ?? this.cleanState.isLng;
    this.cleanState.isErr = isErr ?? this.cleanState.isErr;
    this.cleanState.err = err ?? this.cleanState.err;
    this.cleanState.all = all ?? this.cleanState.all;
    this.cleanState.one = one ?? this.cleanState.one;
    this.cleanState.mutitem = mutitem ?? this.cleanState.mutitem;
  }

  _urlWithParams(params) {
    let urlWithParams = this.url;
    if (typeof params === "object") {
      const paramsKeys = Object.keys(params);
      for (let key of paramsKeys) {
        if (params[key] !== this.getAllReqParams[key]) {
          this.whenAllGet = 0;
          this.getAllReqParams = params;
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
    if (typeof params === "string" && params.length > 0) {
      const paramsArr = params.split("&");
      for (let i = 0; i < paramsArr.length; i++) {
        let item = paramsArr[i].split("=");
        if (this.getAllReqParams[item[0]] !== item[1]) {
          this.whenAllGet = 0;
          break;
        }
      }
      for (let i = 0; i < paramsArr.length; i++) {
        let item = paramsArr[i].split("=");
        this.getAllReqParams[item[0]] = item[1];
      }
      urlWithParams += "?" + params;
    }
    return urlWithParams;
  }

  _setError(error) {
    this.state.err.value = error;
    this.state.isErr.value = true;
    this.state.isLng.value = false;
    this._setCleanState({ err: error, isErr: true, isLng: false });
  }

  _setLoad() {
    this.state.isLng.value = true;
    this.state.err.value = {};
    this.state.isErr.value = false;
    this._setCleanState({ isLng: true, err: {}, isErr: false });
  }

  _setMutationData(data) {
    this.whenAllGet = 0;
    this.whenOneGet = 0;
    this.state.mutitem.value = data;
    this.state.isLng.value = false;
    this.getAll(this.params);
    this._setCleanState({ mutitem: data, isLng: false });
  }

  _returner({ which, modif }) {
    return {
      modif,
      data: computed(() => this.state[which]['value']),
      isLng: computed(() => this.state.isLng.value),
      isErr: computed(() => this.state.isErr.value),
      err: computed(() => this.state.err.value)
    }
  }
}


export class VuexResouce extends Resource {
  _setStateLoad(state) {
    state['isLng'] = true;
    state['isErr'] = false;
    state['err'] = {};
  }

  _setStateData(state, data) {
    state['all'] = data;
    state['isLng'] = false;
  }

  _setStateError(state, error) {
    state['err'] = error
    state['isErr'] = true;
    state['isLng'] = false;
  }

  getAllMutation(state, { params, config }) {
    this.params = params;
    let urlWithParams = this._urlWithParams(params);
    if ((Date.now() - this.whenAllGet) > (this.expiresIn * 60000)) {
      this._setLoad();
      this._setStateLoad(state);
      this.runner.get(urlWithParams, config)
        .then((res) => {
          this.whenAllGet = Date.now();
          this.state.all.value = res.data;
          this.state.isLng.value = false;
          this._setCleanState({ all: res.data, isLng: false });
          state['all'] = res.data;
          state['isLng'] = false;
        })
        .catch((error) => {
          this._setError(error.response.data);
          this._setStateError(state, error.response.data);
        })
    }
    return this.cleanState;
  }

  getOneMutation(state, { param, config }) {
    if ((Date.now() - this.whenOneGet) > (this.expiresIn * 60000)) {
      this._setLoad();
      this._setStateLoad(state);
      this.runner.get(this.url + "/" + param, config)
        .then((res) => {
          this.whenOneGet = Date.now();
          this.state.one.value = res.data;
          this.state.isLng.value = false;
          this._setCleanState({ one: res.data, isLng: false });
          state['one'] = res.data;
          state['isLng'] = false;
        })
        .catch((error) => {
          this._setError(error.response.data);
          this._setStateError(state, error.response.error);
        })
    }
    return this.cleanState;
  }

  createMutation(state, { config, data, options }) {
    this._setLoad();
    this._setStateLoad(state);
    this.runner.post(this.url, data, config)
      .then((res) => {
        this._setMutationData(res.data);
        state['mutitem'] = res.data;
        state['isLng'] = false;
        options?.onSuccess && options.onSuccess(res.data);
      })
      .catch((error) => {
        this._setError(error.response.data);
        this._setStateError(state, error.response.error);
        options?.onError && options.onError(error.response.data);
      })
    return this.cleanState;
  }

  updateMutation(state, { param, config, data, options }) {
    this._setLoad();
    this._setStateLoad(state);
    this.runner.put(this.url + "/" + param, data, config)
      .then((res) => {
        this._setMutationData(res.data);
        state['mutitem'] = res.data;
        state['isLng'] = false;
        options?.onSuccess && options.onSuccess(res.data);
      })
      .catch((error) => {
        this._setError(error.response.data);
        this._setStateError(state, error.response.error);
        options?.onError && options.onError(error.response.data);
      })
    return this.cleanState;
  }

  patchMutation(state, { param, config, data, options }) {
    this._setLoad();
    this._setStateLoad(state);
    this.runner.patch(this.url + "/" + param, data, config)
      .then((res) => {
        this._setMutationData(res.data);
        state['mutitem'] = res.data;
        state['isLng'] = false;
        options?.onSuccess && options.onSuccess(res.data);
      })
      .catch((error) => {
        this._setError(error.response.data);
        this._setStateError(state, error.response.error);
        options?.onError && options.onError(error.response.data);
      })
    return this.cleanState;
  }

  deleteMutation(state, { param, config, options }) {
    this._setLoad();
    this._setStateLoad(state);
    this.runner.delete(this.url + "/" + param, config)
      .then((res) => {
        this._setMutationData(res.data);
        state['mutitem'] = res.data;
        state['isLng'] = false;
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

export class ApiResource extends Resource {
  getAll(params, config) {
    this.params = params;
    let urlWithParams = this._urlWithParams(params);
    if ((Date.now() - this.whenAllGet) > (this.expiresIn * 60000)) {
      this._setLoad();
      this.runner.get(urlWithParams, config)
        .then((res) => {
          this.whenAllGet = Date.now();
          this.state.all.value = res.data;
          this.state.isLng.value = false;
        })
        .catch((error) => {
          this._setError(error.response.data);
        })
    }
    return this._returner({ which: "all" });
  }

  getOne(param, config) {
    if ((Date.now() - this.whenOneGet) > (this.expiresIn * 60000)) {
      this._setLoad();
      this.runner.get(this.url + "/" + param, config)
        .then((res) => {
          this.whenOneGet = Date.now();
          this.state.one.value = res.data;
          this.state.isLng.value = false;
        })
        .catch((error) => {
          this._setError(error.response.data);
        })
    }
    return this._returner({ which: "one" });
  }

  create(config) {
    this.state.isLng.value = false;
    const modif = (data, options) => {
      this._setLoad();
      this.runner.post(this.url, data, config)
        .then((res) => {
          this._setMutationData(res.data);
          options?.onSuccess && options.onSuccess(res.data);
        })
        .catch((error) => {
          this._setError(error.response.data);
          options?.onError && options.onError(error.response.data);
        })
    }
    return this._returner({ which: "mutitem", modif });
  }

  update(param, config) {
    this.state.isLng.value = false;
    const modif = (data, options) => {
      this._setLoad();
      this.runner.put(this.url + "/" + param, data, config)
        .then((res) => {
          this._setMutationData(res.data);
          options?.onSuccess && options.onSuccess(res.data);
        })
        .catch((error) => {
          this._setError(error.response.data);
          options?.onError && options.onError(error.response.data);
        })
    }
    return this._returner({ which: "mutitem", modif });
  }

  patch(param, config) {
    this.state.isLng.value = false;
    const modif = (data, options) => {
      this._setLoad();
      this.runner.patch(this.url + "/" + param, data, config)
        .then((res) => {
          this._setMutationData(res.data);
          options?.onSuccess && options.onSuccess(res.data);
        })
        .catch((error) => {
          this._setError(error.response.data);
          options?.onError && options.onError(error.response.data);
        })
    }
    return this._returner({ which: "mutitem", modif });
  }

  delete(param, config) {
    this.state.isLng.value = false;
    const modif = (options) => {
      this._setLoad();
      this.runner.delete(this.url + "/" + param, config)
        .then((res) => {
          this._setMutationData(res.data);
          options?.onSuccess && options.onSuccess(res.data);
        })
        .catch((error) => {
          this._setError(error.response.data);
          options?.onError && options.onError(error.response.data);
        })
    }
    return this._returner({ which: "mutitem", modif });
  }
}