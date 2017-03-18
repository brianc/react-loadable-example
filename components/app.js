import React from 'react';
import { render } from 'react-dom';
import { NotFound } from './status';
import Loadable from './react-loadable';
import Loading from './loading';

let Topics = Loadable({
  loader: () => import('./topics'),
  LoadingComponent: Loading,
  delay: 200,
  serverSideRequirePath: `${__dirname}/topics`,
  webpackRequireWeakId: () => require.resolveWeak('./topics'),
});

let Something = Loadable({
  loader: () => import('./something'),
  LoadingComponent: Loading,
  delay: 200,
  serverSideRequirePath: `${__dirname}/something`,
  webpackRequireWeakId: () => require.resolveWeak('./something'),
});

import { Link, Route, Switch } from 'react-router-dom'

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
)

const About = () => (
  <div>
    <h2>About</h2>
  </div>
)

class App extends React.Component {
  static childContextTypes = {
    requires: React.PropTypes.array,
  }

  state = {
    child: (<button onClick={() => this.loadChild()}>Load child</button>)
  }

  getChildContext() {
    return { requires: this.props.requires }
  }

  loadChild() {
    this.setState({
      child: (<Something />)
    })
  }

  render () {
    const { child } = this.state
    return (
      <div>
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/about'>About</Link>
          </li>
          <li>
            <Link to='/topics'>Topics</Link>
          </li>
        </ul>
        <hr />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/topics" component={Topics} />
          <Route component={NotFound} />
        </Switch>
        <hr />
        {child}
      </div>
    );
  }
}

export default App
