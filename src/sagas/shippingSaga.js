import fetch from 'isomorphic-fetch';
import { select, put, takeLatest, call, apply } from 'redux-saga/effects';

import {
  FETCHED,
  FETCHING,
  SET_CART_ITEMS,
  setShippingCost,
  INCREASE_ITEM_QUANTITY,
  DECREASE_ITEM_QUANTITY,
  setShippingFetchStatus,
} from '../actions';
import { cartItemsSelector } from '../selectors';
import { SERVER_BASE_URL } from '../../server/constants';

export function* shippingSaga() {
  yield takeLatest(
    [SET_CART_ITEMS, INCREASE_ITEM_QUANTITY, DECREASE_ITEM_QUANTITY],
    computeShipping
  );
}

export function* computeShipping() {
  yield put(setShippingFetchStatus(FETCHING));
  const items = yield select(cartItemsSelector);

  const queryParam = items
    .map((item) => {
      const quantity = item.get('quantity');

      return new Array(quantity).fill(item.get('id'));
    })
    .join();

  const response = yield call(
    fetch,
    `${SERVER_BASE_URL}/shipping/${queryParam}`
  );
  const { total } = yield apply(response, response.json);

  yield put(setShippingCost(total));
  yield put(setShippingFetchStatus(FETCHED));
}
