import { createGlobalStyle } from 'styled-components';

/**
 * Global styles of the application.
 */
export const GlobalStyle = createGlobalStyle`
  *,
  *:before,
  *:after {
    background-repeat: no-repeat;
    box-sizing: border-box;
  }

  html,
  body {
    width: 100%;
    height: 100%;
    margin: 0;
  }

  *:first-child {
    margin-top: 0;
  }

  *:last-child {
    margin-bottom: 0;
  }

  textarea,
  input,
  button {
    font-family: inherit;
  }

  input[type=checkbox],
  input[type=radio],
  input[type=submit],
  input[type=reset],
  input[type=file],
  button,
  a {
    cursor: pointer;
  }
`;
