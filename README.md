# flight-with-observable-state

[![Build Status](https://secure.travis-ci.org/flightjs/flight-with-observable-state.svg)](http://travis-ci.org/flightjs/flight-with-observable-state)

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

`withObservableState` includes the [flight-with-state](https://github.com/flightjs/flight-with-state) mixin, and as such provides all of those methods as part of its API. You do not need to include `withState` in your own component. `withObservableState` also introduces the `observableState` property.

### `observableState`

`observableState` property provides an observable stream of the component's changing state. In actuality it is an instance of a [RXJS Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md) connected to a [RXJS BehaviourSubject](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/subjects/behaviorsubject.md).

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
