import fetch from 'isomorphic-fetch';
import { take, put, call, apply } from 'redux-saga/effects';

import { SERVER_BASE_URL } from '../../server/constants';
import { GET_CURRENT_USER_INFO, setCurrentUser } from '../actions';

export function* currentUserSaga() {
  const { id } = yield take(GET_CURRENT_USER_INFO);

  const response = yield call(fetch, `${SERVER_BASE_URL}/user/${id}`);
  const user = yield apply(response, response.json);

  yield put(setCurrentUser(user));
}
