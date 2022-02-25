import fetch from 'isomorphic-fetch';
import { take, put, apply } from 'redux-saga/effects';

import { SERVER_BASE_URL } from '../../server/constants';
import { SET_CURRENT_USER, setCartItems } from '../actions';

export function* fetchCartSaga() {
  const {
    user: { id },
  } = yield take(SET_CURRENT_USER);

  const response = yield fetch(`${SERVER_BASE_URL}/cart/${id}`);
  const { items: cartItems } = yield apply(response, response.json);

  yield put(setCartItems(cartItems));
}
