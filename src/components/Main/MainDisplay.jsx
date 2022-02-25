import React from 'react';

import { CartManageViewContainer } from '../CartManageView';
import { CheckoutStatusViewContainer } from '../CheckoutStatusView';

export const MainDisplay = ({ isCheckingOut }) => (
  <>
    {isCheckingOut ? (
      <CheckoutStatusViewContainer />
    ) : (
      <CartManageViewContainer />
    )}
  </>
);
