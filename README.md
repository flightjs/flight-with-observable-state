# flight-with-observable-state

[![Build Status](https://secure.travis-ci.org/ahume/flight-with-observable-state.png)](http://travis-ci.org/ahume/flight-with-observable-state)

A [Flight](https://github.com/flightjs/flight) mixin which extends the [flight-with-state](https://github.com/flightjs/flight-with-state) mixin by exposing the component's state as an observable stream.

## Installation

```bash
bower install --save flight-with-observable-state
```

## Example

Here's an example component that uses `withObservableState`.

```js
var ToggleButton = flight.component(
    // Use `withObservableState` before your component definition.
    withObservableState,
    function toggleButton() {
        this.attributes({
            initiallyActive: false
        });

        // Define an instance's `initialState`
        this.initialState({
            active: false
        });

        this.after('initialize', function () {
            this.on('click', this.toggle);

            // Subscribe to a stream of the changing state
            this.observableState.subscribe(this.update.bind(this));

            // Transition the state using `replaceState`
            this.replaceState({
                active: this.attr.initiallyActive
            });
        });

        this.toggle = function () {
            // Merge changes onto the state using `mergeState`
            this.mergeState({
                // Access the current state using `this.state`
                active: !this.state.active
            });
        };

        this.update = function (state) {
            this.$node.toggleClass('is-active', state.active);
        };
    }
);
```


## API

`withObservableState` includes the [flight-with-state](https://github.com/flightjs/flight-with-state) mixin, and as such provides all of those methods as part of its API. You do not need to include `withState` in your own component. `withObservableState` also introduces the following properties and methods.

### `observableState`

`observableState` property provides an observable stream of the component's changing state. In actuality it is an instance of a [RXJS BehaviourSubject](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/subjects/behaviorsubject.md).

### `getObservableState`

`getObservableState` returns an observableState for the component's state. It takes an optional options argument which can contain a list of keys to subscribe to.

```js
var observableActiveState = this.getObservableState( {keys: ['active'] });
```

This would return an observable stream for the component's state property `active`, and not include changes for any other property. This API allows it to be combined with the [flight-with-resources](https://github.com/ahume/flight-with-resources) mixin so that other components can easily request an observable stream of particular properties of this component's state. For example...

```js
// Subscribe to some state and pipe it into local state.
this.requestResource('applicationState', {keys: ['characterCount']})
    .subscribe(this.mergeState.bind(this));
```


## Development

Development of this component requires [Bower](http://bower.io) to be globally
installed:

```bash
npm install -g bower
```

Then install the Node.js and client-side dependencies by running the following
commands in the repo's root directory.

```bash
npm install & bower install
```

To continuously run the tests in Chrome during development, just run:

```bash
npm run watch-test
```

## Contributing to this project

Anyone and everyone is welcome to contribute. Please take a moment to
review the [guidelines for contributing](CONTRIBUTING.md).

* [Bug reports](CONTRIBUTING.md#bugs)
* [Feature requests](CONTRIBUTING.md#features)
* [Pull requests](CONTRIBUTING.md#pull-requests)
