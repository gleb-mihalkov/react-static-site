import React, { FC } from 'react';

import { GlobalFonts } from './GlobalFonts';
import { GlobalStyle } from './GlobalStyle';

/**
 * Component of the application.
 */
export const App: FC = () => (
  <>
    <GlobalFonts />
    <GlobalStyle />
  </>
);
