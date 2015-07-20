describeMixin('lib/with-observable-state', function () {
    'use strict';

    beforeEach(function () {
        this.setupComponent();
    });

    it('should turn state into observableState', function () {
        expect(this.component.observableState).toBeDefined();
        expect(this.component.observableState.subscribe).toBeDefined();
    });

    it('should push new state value on to the stream', function (done) {
        this.component.observableState.subscribeOnNext(function (state) {
            if (state.active === true) {
                done();
            }
        });
        this.component.mergeState({
            active: true
        });
    });
});