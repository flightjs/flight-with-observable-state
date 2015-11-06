/**
 * with-observable-state uses RXJS to implement its observer/observable
 * patterns.
 * https://github.com/Reactive-Extensions/RxJS
 */
import { compose } from 'flight';
import withState from 'flight-with-state';
import Rx from 'rx';

export default function withObservableState() {
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
