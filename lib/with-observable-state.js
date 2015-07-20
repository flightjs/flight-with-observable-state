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

        this.after('initialize', function () {
            // Construct stream with an initial value of the components state.
            var stateSubject = new Rx.BehaviorSubject(this.state);

            // Expose only the observable, so nothing else can push values on to the stream.
            this.observableState = stateSubject.asObservable();

            // When component state changes, push values on to the stream.
            this.after('stateChanged', stateSubject.onNext.bind(stateSubject));
        });
    }
});