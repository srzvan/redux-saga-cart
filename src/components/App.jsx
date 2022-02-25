import React from 'react';
import { Provider } from 'react-redux';

import { getStore } from '../getStore';
import { MainContainer } from '../components';
import { getCurrentUserInfo } from '../actions';

const store = getStore();

export const App = () => (
  <Provider store={store}>
    <MainContainer />
  </Provider>
);

store.dispatch(getCurrentUserInfo(`U10000`));
