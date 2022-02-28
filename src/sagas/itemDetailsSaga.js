import fetch from 'isomorphic-fetch';
import { take, fork, put, apply, call, all } from 'redux-saga/effects';

import { SERVER_BASE_URL } from '../../server/constants';
import { SET_CART_ITEMS, setItemDetails } from '../actions';

export function* itemDetailsSaga() {
  const { items } = yield take(SET_CART_ITEMS);

  yield all(items.map((item) => fork(loadItemDetails, item)));
}

export function* loadItemDetails(item) {
  const { id } = item;

  const response = yield call(fetch, `${SERVER_BASE_URL}/items/${id}`);
  const data = yield apply(response, response.json);

  yield put(setItemDetails(...data));
}
