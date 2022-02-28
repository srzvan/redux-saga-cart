import { all, put, select, take, takeEvery } from 'redux-saga/effects';

import {
  setItemPrice,
  SET_CART_ITEMS,
  SET_CURRENT_USER,
  SET_ITEM_DETAILS,
} from '../actions';
import { currentUserSelector } from '../selectors';

export function* itemPriceSaga() {
  yield all([
    take(SET_CURRENT_USER),
    take(SET_CART_ITEMS),
    takeEvery(SET_ITEM_DETAILS, fetchItemPrice),
  ]);
}

export function* fetchItemPrice({ item }) {
  const user = yield select(currentUserSelector);
  const currency = yield user.get('country').toLowerCase();

  const { id } = item;
  const price = item[currency];

  yield put(setItemPrice(id, price));
}
