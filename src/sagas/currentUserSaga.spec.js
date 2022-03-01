import fetch from 'isomorphic-fetch';
import { take, call, put, apply } from 'redux-saga/effects';

import { currentUserSaga } from '.';
import { SERVER_BASE_URL } from '../../server/constants';
import { GET_CURRENT_USER_INFO, setCurrentUser } from '../actions';

describe('currentUserSaga', () => {
  const id = 'NCC1701';
  const user = { name: 'Johnny Cage' };
  const json = () => {};
  const response = { json };
  const userInfoEndpoint = `${SERVER_BASE_URL}/user/${id}`;

  test(`It fetches and puts the current user's data`, () => {
    const generator = currentUserSaga();

    expect(generator.next().value).toEqual(take(GET_CURRENT_USER_INFO));
    expect(generator.next({ id }).value).toEqual(call(fetch, userInfoEndpoint));
    expect(generator.next(response).value).toEqual(
      apply(response, response.json)
    );
    expect(generator.next(user).value).toEqual(put(setCurrentUser(user)));
  });
});
