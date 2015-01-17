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

        it('should stream changed values', function (done) {
            instanceA.observableState.subscribe(function (state) {
                if (state.count === 2) {
                    done();
                }
            });
            instanceA.mergeState({
                count: 2
            })
        });

        it('should not stream unchanged values', function (done) {
            var called = 0;
            instanceA.getObservableState().subscribe(function (state) {
                called = called + 1;
            });
            instanceA.mergeState({
                count: 1
            });
            expect(called).toBe(1)
            setTimeout(function () {
                done();
            }, 10);
        });

        it('should only provide stream for requested keys', function (done) {
            instanceA.getObservableState({keys: ['count']}).subscribe(function (state) {
                expect(state.alive).toBe(undefined);
                expect(state.count).toBe(1);
                done();
            });
        });
    });
});
