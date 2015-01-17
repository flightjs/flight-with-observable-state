define(function (require) {
    'use strict';

    var compose = require('flight/lib/compose');
    var Rx = require('rxjs');

    var withState = require('flight-with-state');

    return withObservableState;
    function withObservableState() {
        /* jshint validthis: true */

        compose.mixin(this, [withState]);

        this.after('initialize', function () {
            this.observableState = new Rx.BehaviorSubject(this.state);
            this.after('stateChanged', this.observableState.onNext.bind(this.observableState));
        });

        this.getObservableState = function (config) {
            config = config || {};
            config.keys = config.keys

            return this.observableState
                .map(filterKeys(config.keys))
                .distinctUntilChanged(undefined, anyKeysHaveChanged());
        };
    };

    function anyKeysHaveChanged() {
        return function (next, previous) {
            return !Object.keys(next).some(function (key) {
                return previous[key] !== next[key];
            });
        };
    };

    function filterKeys(keys) {
        return function (newState) {
            if (!keys) {
                return newState;
            }

            // Filter for wanted keys
            return keys.reduce(function (o, key) {
                o[key] = newState[key];
                return o;
            }, {});
        };
    };

});
