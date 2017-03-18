# React Isomorphic Loadable Example

This is an example of isomorphic code splitting, routing, and rendering using react, [react-router](https://github.com/ReactTraining/react-router), and a custom modified version of [react-loadable](https://github.com/thejameskyle/react-loadable).

[prior art](https://medium.com/@thejameskyle/react-loadable-2674c59de178#.qwun60j1y)

In that blog post there's a link to what [the future might look like](https://gist.github.com/thejameskyle/abecfe8ec2a7ce1e312a904527a31908) but since that code doesn't exist yet I tried to build out one approach.

**Running locally**

```js
git clone git@github.com:brianc/react-loadable-example.git
cd react-loadable-example
yarn install
yarn start
```

Then open up [localhost:3000](http://localhost:3000) in your browser.  
The page is first rendered [on the server](https://github.com/brianc/react-loadable-example/blob/master/app.js#L60) & then react re-renders on the client and takes over.  React-router routes are matched server-side and client-side so any route in the app can be `cmd+r` refreshed in the browser, re-rendered on the server, and then once again react in the browser takes over when that route loads.

If you want to start with a client-only rendered page you can open [localhost:3000/empty](http://localhost:3000/empty)

This is basically a big amalgamation of a bunch of previous work and some hacks using [context](https://facebook.github.io/react/docs/context.html) to track which files are loaded on the server & then figure out which bundles from webpack to eager load on the client.
