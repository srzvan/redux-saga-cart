import fetch from 'isomorphic-fetch';
import { put, all, call, select, takeLatest } from 'redux-saga/effects';

import {
  FETCHED,
  FETCHING,
  decreaseItemQuantity,
  INCREASE_ITEM_QUANTITY,
  DECREASE_ITEM_QUANTITY,
  setItemQuantityFetchStatus,
} from '../actions';
import { currentUserSelector } from '../selectors';
import { SERVER_BASE_URL } from '../../server/constants';

export function* itemQuantitySaga() {
  yield all([
    takeLatest(INCREASE_ITEM_QUANTITY, handleIncreseItemQuantity),
    takeLatest(DECREASE_ITEM_QUANTITY, handleDecreaseItemQuantity),
  ]);
}

export function* handleIncreseItemQuantity({ id }) {
  yield put(setItemQuantityFetchStatus(FETCHING));

  const user = yield select(currentUserSelector);
  const userId = user.get('id');

  const response = yield call(
    fetch,
    `${SERVER_BASE_URL}/cart/add/${userId}/${id}`
  );

  if (response.status !== 200) {
    yield put(decreaseItemQuantity(id));
    alert(
      `Sorry, there weren't enought items in stock to complete your request`
    );
  }

  yield put(setItemQuantityFetchStatus(FETCHED));
}

export function* handleDecreaseItemQuantity({ id, local }) {
  if (local) {
    return;
  }

  yield put(setItemQuantityFetchStatus(FETCHING));

  const user = yield select(currentUserSelector);
  const userId = user.get('id');

  const response = yield call(
    fetch,
    `${SERVER_BASE_URL}/cart/remove/${userId}/${id}`
  );

  if (response.status !== 200) {
    console.warn(
      'handleDecreaseItemQuantity - received non-200 status',
      response
    );
  }

  yield put(setItemQuantityFetchStatus(FETCHED));
}
