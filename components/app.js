import React from 'react';
import { render } from 'react-dom';
import { NotFound } from './not-found';
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

const Topics = ({ match }) => (
  <div>
    <h2>Topics</h2>
    <ul>
      <li>
        <Link to={`${match.url}/rendering`}>
          Rendering with React
        </Link>
      </li>
      <li>
        <Link to={`${match.url}/components`}>
          Components
        </Link>
      </li>
      <li>
        <Link to={`${match.url}/props-v-state`}>
          Props v. State
        </Link>
      </li>
    </ul>

    <Route path={`${match.url}/:topicId`} component={Topic}/>
    <Route exact path={match.url} render={() => (
      <h3>Please select a topic.</h3>
    )}/>
  </div>
)

const Topic = ({ match }) => (
  <div>
    <h3>{match.params.topicId}</h3>
  </div>
)

class App extends React.Component {
  static childContextTypes = {
    requires: React.PropTypes.array,
  }

  state = {
    child: (<p>empty</p>)
  }

  getChildContext() {
    return { requires: this.props.requires }
  }

  loadChild = () => {
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
      </div>
    );
  }
}

export default App
