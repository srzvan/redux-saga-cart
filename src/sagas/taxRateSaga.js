import fetch from 'isomorphic-fetch';
import { take, put, call, apply } from 'redux-saga/effects';

import { SERVER_BASE_URL } from '../../server/constants';
import { SET_CURRENT_USER, setTaxRate } from '../actions';

export function* taxRateSaga() {
  const { user } = yield take(SET_CURRENT_USER);
  const { country: currency } = user;

  const response = yield call(fetch, `${SERVER_BASE_URL}/TAX/${currency}`);
  const { rate } = yield apply(response, response.json);

  yield put(setTaxRate(rate));
}
