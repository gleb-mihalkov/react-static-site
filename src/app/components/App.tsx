import React, { FC } from 'react';

import { GlobalFonts } from './GlobalFonts';
import { GlobalStyle } from './GlobalStyle';

import { Sample } from 'common';

/**
 * Component of the application.
 */
export const App: FC = () => (
  <>
    <GlobalFonts />
    <GlobalStyle />
    <Sample />
  </>
);
