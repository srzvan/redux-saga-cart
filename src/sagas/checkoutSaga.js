import fetch from 'isomorphic-fetch';
import { take, call, put, select, apply } from 'redux-saga/effects';

import {
  setCheckoutPhase,
  TOGGLE_CHECKING_OUT,
  ERROR_CHECKOUT_PHASE,
  SUCCESS_CHECKOUT_PHASE,
  CREDIT_VALIDATION_CHECKOUT_PHASE,
  PURCHASE_FINALIZATION_CHECKOUT_PHASE,
  QUANTITY_VERIFICATION_CHECKOUT_PHASE,
} from '../actions';
import { currentUserSelector } from '../selectors';
import { SERVER_BASE_URL } from '../../server/constants';

export function* checkoutSaga() {
  while (true) {
    const isCheckingOut = yield take(TOGGLE_CHECKING_OUT);

    if (isCheckingOut) {
      yield call(checkout);
    }
  }
}

export function* checkout() {
  const user = yield select(currentUserSelector);
  const userId = user.get('id');

  yield put(setCheckoutPhase(QUANTITY_VERIFICATION_CHECKOUT_PHASE));
  const isCartValid = yield call(validateCart, userId);

  if (!isCartValid) {
    yield put(setCheckoutPhase(ERROR_CHECKOUT_PHASE));
    return;
  }

  yield put(setCheckoutPhase(CREDIT_VALIDATION_CHECKOUT_PHASE));
  const isCreditCardValid = yield call(validateCreditCard, userId);

  if (!isCreditCardValid) {
    yield put(setCheckoutPhase(ERROR_CHECKOUT_PHASE));
    return;
  }

  yield put(setCheckoutPhase(PURCHASE_FINALIZATION_CHECKOUT_PHASE));
  const isPurchaseSuccessful = yield call(executePurchase, userId);

  if (!isPurchaseSuccessful) {
    yield put(setCheckoutPhase(ERROR_CHECKOUT_PHASE));
    return;
  }

  yield put(setCheckoutPhase(SUCCESS_CHECKOUT_PHASE));
}

export function* validateCart(userId) {
  const response = yield call(
    fetch,
    `${SERVER_BASE_URL}/cart/validate/${userId}`
  );
  const { validated: isValid } = yield apply(response, response.json);

  return isValid;
}

export function* validateCreditCard(userId) {
  const response = yield call(
    fetch,
    `${SERVER_BASE_URL}/card/validate/${userId}`
  );
  const { validated: isValid } = yield apply(response, response.json);

  return isValid;
}

export function* executePurchase(userId) {
  const response = yield call(
    fetch,
    `${SERVER_BASE_URL}/card/charge/${userId}`
  );
  const { success: isSuccessful } = yield apply(response, response.json);

  return isSuccessful;
}
