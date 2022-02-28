import React from 'react';

import { CHECKOUT_PHASE } from '../../actions';

export const CheckoutStatusViewDisplay = ({ phase }) => (
  <div className="text-center">
    <h1>Checking out</h1>
    <div>
      <section>
        {
          {
            [CHECKOUT_PHASE.QUANTITY_VERIFICATION]: (
              <>
                <div className="loader xl" />
                <h2>Verifying items are in stock...</h2>
              </>
            ),
            [CHECKOUT_PHASE.CREDIT_VALIDATION]: (
              <>
                <div className="loader xl" />
                <h2>Validating credit card information...</h2>
              </>
            ),
            [CHECKOUT_PHASE.PURCHASE_FINALIZATION]: (
              <>
                <div className="loader xl" />
                <h2>Finalizing purchase...</h2>
              </>
            ),
            [CHECKOUT_PHASE.SUCCESS]: (
              <>
                <h1>Thank you</h1>
                <h2>Your checkout is complete.</h2>
              </>
            ),
            [CHECKOUT_PHASE.ERROR]: (
              <>
                <h2>An error occurred.</h2>
                <p>
                  Funds on your credit card were insufficient, or an error
                  occurred while communicating with the server.
                </p>
              </>
            ),
          }[phase]
        }
      </section>
    </div>
  </div>
);
