import { component } from 'flight';
import withObservableState from '.';

describe('withObservableState', function () {
    var Component = component(withObservableState, function Base() {});

    beforeEach(function () {
        Component.teardownAll();
        this.component = (new Component()).initialize(document.body);
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
