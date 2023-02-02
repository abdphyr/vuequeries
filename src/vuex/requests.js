import { ref, computed } from "vue";
import { runner } from "../axios";

class Request {
  state;
  url;
  commit;
  MUTNAME;
  constructor(options, tokenKey) {
    this.url = typeof options === "string" ? options : options.url;
    this.state = {
      isLng: true,
      isErr: false,
      err: {},
      data: {}
    }
    this.commit = () => { };
    this.runner = runner(tokenKey ?? options.tokenKey);
    this.MUTNAME = "vuexRequest" + Math.round(Math.random() * 1_000_000) + Math.round(Math.random() * 1_000_000);
  }

  _setState({ isLng, isErr, err, data }) {
    this.state.isLng = isLng ?? this.state.isLng;
    this.state.isErr = isErr ?? this.state.isErr;
    this.state.err = err ?? this.state.err;
    this.state.data = data ?? this.state.data;
  }

  _setError(error) {
    this._setState({ err: error, isErr: true, isLng: false, data: {} });
    this.commit(this.MUTNAME, this.state);
  }

  _setData(data) {
    this._setState({ data, isLng: false });
    this.commit(this.MUTNAME, this.state);
  }

  _setLoad() {
    this._setState({ isLng: true, err: {}, isErr: false });
    this.commit(this.MUTNAME, this.state);
  }
}

export class VuexGet extends Request {
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

  action(commit, options) {
    this.commit = commit;
    let path = this._urlWithParams(options && options['param'])
    if ((Date.now() - this.#whenGet) > (this.#expiresIn * 60000)) {
      this._setLoad();
      this.runner.get(path, options && options['config'])
        .then((res) => {
          this.#whenGet = Date.now();
          this._setData(res.data);
        })
        .catch((error) => {
          this._setError(error.response.data);
        })
    }
  }
}

export class VuexPost extends Request {
  action(commit, { config, data, options }) {
    this.commit = commit;
    this._setLoad()
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
}

export class VuexPut extends Request {
  action(commit, { param, config, data, options }) {
    this.commit = commit;
    this._setLoad()
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
}

export class VuexPatch extends Request {
  action(commit, { param, config, data, options }) {
    this.commit = commit;
    this._setLoad()
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
}

export class VuexDelete extends Request {
  action(commit, { param, config, options }) {
    this.commit = commit;
    this._setLoad()
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
}
