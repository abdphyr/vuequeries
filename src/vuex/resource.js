import { runner } from "../axios";

export class VuexResouce {
  state;
  params;
  url;
  expiresIn;
  whenAllGet;
  whenOneGet;
  getAllReqParams;
  commit;
  MUTNAME;
  constructor(options, tokenKey, expiresIn) {
    this.url = typeof options === "string" ? options : options.url;
    this.expiresIn = expiresIn ?? options.expiresIn ?? 10;
    this.whenOneGet = 0;
    this.whenAllGet = 0;
    this.getAllReqParams = {};
    this.state = {
      isLng: true,
      isErr: false,
      err: {},
      all: {},
      one: null,
      mutitem: null,
    }
    this.commit = () => { };
    this.runner = runner(tokenKey ?? options.tokenKey);
    this.MUTNAME = "vuexResource" + Math.round(Math.random() * 1_000_000) + Math.round(Math.random() * 1_000_000);
  }

  _setState({ isLng, isErr, err, all, one, mutitem }) {
    this.state.isLng = isLng ?? this.state.isLng;
    this.state.isErr = isErr ?? this.state.isErr;
    this.state.err = err ?? this.state.err;
    this.state.all = all ?? this.state.all;
    this.state.one = one ?? this.state.one;
    this.state.mutitem = mutitem ?? this.state.mutitem;
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
    this._setState({ err: error, isErr: true, isLng: false });
    this.commit(this.MUTNAME, this.state);
  }

  _setLoad() {
    this._setState({ isLng: true, err: {}, isErr: false });
    this.commit(this.MUTNAME, this.state);
  }

  _setMutationData(data) {
    this.whenAllGet = 0;
    this.whenOneGet = 0;
    this._setState({ mutitem: data, isLng: false });
    this.getAll(this.commit, this.params);
    this.commit(this.MUTNAME, this.state);
  }

  getAll(commit, options) {
    this.commit = commit;
    this.params = options && options['params'];
    let urlWithParams = this._urlWithParams(options && options['params']);
    if ((Date.now() - this.whenAllGet) > (this.expiresIn * 60000)) {
      this._setLoad();
      this.runner.get(urlWithParams, options && options['config'])
        .then((res) => {
          this.whenAllGet = Date.now();
          this._setState({ all: res.data, isLng: false });
          this.commit(this.MUTNAME, this.state);
        })
        .catch((error) => {
          this._setError(error.response.data);
        })
    }
  }

  getOne(commit, { param, config }) {
    this.commit = commit;
    if ((Date.now() - this.whenOneGet) > (this.expiresIn * 60000)) {
      this._setLoad();
      this.runner.get(this.url + "/" + param, config)
        .then((res) => {
          this.whenOneGet = Date.now();
          this._setState({ one: res.data, isLng: false });
          this.commit(this.MUTNAME, this.state);
        })
        .catch((error) => {
          this._setError(error.response.data);
        })
    }
  }

  create(commit, { config, data, options }) {
    this.commit = commit
    this._setLoad()
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

  update(commit, { param, config, data, options }) {
    this.commit = commit;
    this._setLoad()
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

  patch(commit, { param, config, data, options }) {
    this.commit = commit;
    this._setLoad()
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

  delete(commit, { param, config, options }) {
    this.commit = commit;
    this._setLoad()
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
}
