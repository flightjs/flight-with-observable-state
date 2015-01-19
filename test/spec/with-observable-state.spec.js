define(function (require) {
    'use strict';

    var component = require('flight/lib/component');
    var withObservableState = require('lib/with-observable-state');

    describe('withObservableState', function () {

        function makeComponent(Component) {
            return component(withObservableState, Component);
        }

        function initializeComponent(Component, fixture, opts) {
            return (new Component()).initialize(fixture || document.body, opts);
        }

        var ComponentA;
        var instanceA;

        beforeEach(function () {
            ComponentA = makeComponent(function () {
                this.initialState({
                    alive: true,
                    count: 1,
                    name: 'name'
                });
            });

            instanceA = initializeComponent(ComponentA);
        })

        afterEach(function () {
            ComponentA && ComponentA.teardownAll();
        });

        it('should turn state into observableState', function () {
            expect(instanceA).toBeDefined();
            expect(instanceA.observableState.subscribe).toBeDefined();
        });

        it('should provide getObservableState function', function () {
            expect(instanceA.getObservableState().subscribe).toBeDefined();
        });

        it('should stream changed values', function () {
            var currentCount;
            var timesCalled = 0;
            instanceA.observableState.subscribe(function (state) {
                currentCount = state.count;
                timesCalled = timesCalled + 1;
            });
            instanceA.mergeState({
                count: 2
            });
            instanceA.mergeState({
                count: 3
            });
            expect(currentCount).toBe(3);
            // We expect timesCalled to be 3 because the handler is called on
            // initial subscribe and then on the two mergeState calls.
            expect(timesCalled).toBe(3);
        });

        it('should not stream unchanged values', function () {
            var currentCount;
            var timesCalled = 0;
            instanceA.getObservableState().subscribe(function (state) {
                currentCount = state.count;
                timesCalled = timesCalled + 1;
            });
            instanceA.mergeState({
                count: 2 // This should send
            });
            instanceA.mergeState({
                count: 2 // This should not send, because it hasn't changed.
            });

            expect(currentCount).toBe(2);
            // We expect timesCalled to be 2 because the handler is called on
            // initial subscribe and then on the first mergeState.
            expect(timesCalled).toBe(2);
        });

        describe('keys options', function () {

            it('should only provide stream for single requested key', function (done) {
                instanceA.getObservableState({keys: ['count']}).subscribe(function (state) {
                    expect(state.alive).toBe(undefined);
                    expect(state.count).toBe(1);
                    expect(state.name).toBe(undefined);
                    done();
                });
            });

            it('should only provide stream for two requested keys', function (done) {
                instanceA.getObservableState({keys: ['count', 'alive']}).subscribe(function (state) {
                    expect(state.alive).toBe(true);
                    expect(state.count).toBe(1);
                    expect(state.name).toBe(undefined);
                    done();
                });
            });
        });
    });
});
