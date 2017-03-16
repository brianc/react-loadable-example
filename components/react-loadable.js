// @flow
import React from "react";

declare function __webpack_require__(pathOrId: string | number): any;
declare var __webpack_modules__: {};
type GenericComponent<Props> = Class<React.Component<{}, Props, mixed>>;
type LoadedComponent<Props> = GenericComponent<Props>;
type LoadingComponent = GenericComponent<{}>;

let isWebpack = typeof __webpack_require__ !== "undefined";
let requireFn = isWebpack ? __webpack_require__ : module.require;

let babelInterop = obj => {
  // $FlowIgnore
  return obj && obj.__esModule ? obj.default : obj;
};

let tryRequire = (pathOrId: string | number) => {
  try {
    if (isWebpack && !__webpack_modules__[pathOrId]) {
      // if it's not in webpack modules, we wont be able
      // to load it. If we attempt to, we mess up webpack's
      // internal state, so we exit early
      return null;
    }
    // $FlowIgnore
    return babelInterop(requireFn(pathOrId));
  } catch (err) {}
  return null;
};

type Options = {
  loader: () => Promise<LoadedComponent<Props>>,
  LoadingComponent: LoadingComponent,
  delay?: number,
  serverSideRequirePath?: string,
  webpackRequireWeakId?: () => number
};

export default function Loadable<Props: {}, Err: Error>(opts: Options) {
  let loader = opts.loader;
  let LoadingComponent = opts.LoadingComponent;
  let delay = opts.delay || 200;
  let serverSideRequirePath = opts.serverSideRequirePath;
  let webpackRequireWeakId = opts.webpackRequireWeakId;

  let isLoading = false;

  let outsideComponent = null;
  let outsidePromise = null;
  let outsideError = null;

  if (serverSideRequirePath) {
    outsideComponent = tryRequire(serverSideRequirePath);
  }

  let load = () => {
    if (!outsidePromise) {
      isLoading = true;
      outsidePromise = loader()
        .then(Component => {
          isLoading = false;
          outsideComponent = babelInterop(Component);
        })
        .catch(error => {
          isLoading = false;
          outsideError = error;
        });
    }
    return outsidePromise;
  };

  return class Loadable extends React.Component<void, Props, *> {
    _timeout: number;
    _mounted: boolean;

    static contextTypes = {
      requires: React.PropTypes.array
    }

    static preload() {
      load();
    }

    constructor(props) {
      super(props)

      if (isWebpack && webpackRequireWeakId) {
        const weakId = webpackRequireWeakId()
        outsideComponent = tryRequire(weakId);
      }

      this.state = {
        error: outsideError,
        pastDelay: false,
        Component: outsideComponent
      };
    }


    componentWillMount() {
      this._mounted = true;

      if (this.state.Component) {
        return;
      }

      this._timeout = setTimeout(
        () => {
          this.setState({ pastDelay: true });
        },
        delay
      );

      load().then(() => {
        if (!this._mounted) return;
        clearTimeout(this._timeout);
        this.setState({
          error: outsideError,
          pastDelay: false,
          Component: outsideComponent
        });
      });
    }

    componentWillUnmount() {
      this._mounted = false;
      clearTimeout(this._timeout);
    }

    render() {
      if (!isWebpack) {
        this.context.requires.push(serverSideRequirePath)
      }

      let { pastDelay, error, Component } = this.state;

      if (isLoading || error) {
        return (
          <LoadingComponent
            isLoading={isLoading}
            pastDelay={pastDelay}
            error={error}
          />
        );
      } else if (Component) {
        return <Component {...this.props} />;
      } else {
        return null;
      }
    }
  };
}
