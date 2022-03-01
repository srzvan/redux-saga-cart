import { fromJS } from 'immutable';
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
import {
  handleDecreaseItemQuantity,
  handleIncreseItemQuantity,
  itemQuantitySaga,
} from './itemQuantitySaga';

describe('itemQuantitySaga', () => {
  let item, user, cartEndpoints;

  beforeEach(() => {
    item = { id: 11223 };
    user = fromJS({ id: 'U1001' });
    const userId = user.get('id');

    cartEndpoints = {
      add: `${SERVER_BASE_URL}/cart/add/${userId}/${item.id}`,
      remove: `${SERVER_BASE_URL}/cart/remove/${userId}/${item.id}`,
    };
  });

  describe('handleIncreaseItemQuantity', () => {
    let generator;

    beforeEach(() => {
      generator = handleIncreseItemQuantity(item);

      expect(generator.next().value).toEqual(
        put(setItemQuantityFetchStatus(FETCHING))
      );
      expect(generator.next().value).toEqual(select(currentUserSelector));
      expect(generator.next(user).value).toEqual(
        call(fetch, cartEndpoints.add)
      );
    });

    test('It should increase item quantity successfully', () => {
      expect(generator.next({ status: 200 }).value).toEqual(
        put(setItemQuantityFetchStatus(FETCHED))
      );
    });

    test('It should decrease item quantity when receiving non-200 HTTP response status', () => {
      expect(generator.next({ status: 500 }).value).toEqual(
        put(decreaseItemQuantity(item.id))
      );
      expect(generator.next().value).toEqual(
        put(setItemQuantityFetchStatus(FETCHED))
      );
    });
  });

  describe('handleDecreaseItemQuantity', () => {
    let generator;

    beforeEach(() => {
      generator = handleDecreaseItemQuantity(item);

      expect(generator.next().value).toEqual(
        put(setItemQuantityFetchStatus(FETCHING))
      );
      expect(generator.next().value).toEqual(select(currentUserSelector));
      expect(generator.next(user).value).toEqual(
        call(fetch, cartEndpoints.remove)
      );
    });

    test('It should successfully decrease item quantity', () => {
      expect(generator.next({ status: 200 }).value).toEqual(
        put(setItemQuantityFetchStatus(FETCHED))
      );
    });

    test('It should console.warn if it receives a non-200 HTTP status', () => {
      const warn = jest.spyOn(global.console, 'warn');

      expect(generator.next({ status: 500 }).value).toEqual(
        put(setItemQuantityFetchStatus(FETCHED))
      );
      expect(warn).toHaveBeenCalledTimes(1);
    });
  });

  describe('itemQuantitySaga', () => {
    test('It should work... ?', () => {
      const generator = itemQuantitySaga();

      expect(generator.next().value).toEqual(
        all([
          takeLatest(INCREASE_ITEM_QUANTITY, handleIncreseItemQuantity),
          takeLatest(DECREASE_ITEM_QUANTITY, handleDecreaseItemQuantity),
        ])
      );
    });
  });
});
