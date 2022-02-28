import { eventChannel } from 'redux-saga';
import { take, put } from 'redux-saga/effects';
import { setCustomerServiceAvailability } from '../actions';

import { connect } from '../createSocketConnection';

export function* customerServiceAvailabilitySaga() {
  const socket = connect();
  const channel = new eventChannel((emit) => {
    socket.on('SUPPORT_AVAILABLE', enableSupportMessage);
    socket.on('SUPPORT_NOT_AVAILABLE', disableSupportMessage);

    return () => {};

    function enableSupportMessage() {
      emit(true);
    }

    function disableSupportMessage() {
      emit(false);
    }
  });

  while (true) {
    const supportAvailable = yield take(channel);

    yield put(setCustomerServiceAvailability(supportAvailable));
  }
}
