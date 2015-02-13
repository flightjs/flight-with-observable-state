define(function (require) {
    'use strict';

    var compose = require('flight/lib/compose');
    var withState = require('flight-with-state');

    /**
     * with-observable-state uses RXJS to implement its observer/observable
     * patterns.
     * https://github.com/Reactive-Extensions/RxJS
     */
    var Rx = require('rxjs');

    return withObservableState;
    function withObservableState() {
        /* jshint validthis: true */

        compose.mixin(this, [withState]);

        /**
         * After component initialization, with-state will have created some
         * initial this.state (key/value object).
         * Use this state for a new BehaviourSubject, and subscribe to changes
         * to state by advicing stateChanged.
         */
        this.after('initialize', function () {
            this.observableState = new Rx.BehaviorSubject(this.state)
            this.after('stateChanged', this.observableState.onNext.bind(this.observableState));
        });

        /**
         * getObservableState returns an observable stream that shares a
         * single subscription to the underlying stream.
         */
        this.getObservableState = function () {
            return this.observableState.shareValue();
        };

        this.before('teardown', function () {
            this.observableState.dispose();
        });
    }
});