import React, { FC } from 'react';

import { GlobalStyle } from './GlobalStyle';

import { Sample } from 'common';

/**
 * Component of the application.
 */
export const App: FC = () => (
  <>
    <GlobalStyle />
    <Sample />
  </>
);
