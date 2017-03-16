import React from 'react';
import { render } from 'react-dom';
import Loadable from './react-loadable';
import Loading from './Loading';
import fakeDelay from './fakeDelay';
import path from 'path';

let LoadableExample = Loadable({
  loader: () => import('./Example'),
  LoadingComponent: Loading,
  delay: 200,
  serverSideRequirePath: `${__dirname}/Example`,
  webpackRequireWeakId: () => require.resolveWeak('./Example'),
});

class App extends React.Component {
  static childContextTypes = {
    requires: React.PropTypes.array,
  }

  getChildContext() {
    return { requires: this.props.requires }
  }

  render () {
    return (
      <div>
        <h1>Hello World</h1>
        <LoadableExample />
      </div>
    );
  }
}

export default App

const isWebpack = typeof __webpack_require__ !== "undefined";
if (isWebpack) {
  window.onload = () => render(<App />, document.getElementById('root'))
}
