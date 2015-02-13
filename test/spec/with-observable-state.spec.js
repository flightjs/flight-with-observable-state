define(function (require) {
    'use strict';

    var component = require('flight/lib/component');

    describeMixin('lib/with-observable-state', function () {

        beforeEach(function () {
            this.setupComponent();
        });

        it('should turn state into observableState', function () {
            expect(this.component.observableState).toBeDefined();
            expect(this.component.observableState.subscribe).toBeDefined();
        });

        it('should provide getObservableState function', function () {
            expect(this.component.getObservableState().subscribe).toBeDefined();
        });
    });
});