import { createGlobalStyle } from 'styled-components';
import { reset } from 'styled-reset';

const GlobalStyle = createGlobalStyle`
  // Reset CSS
  ${reset}

  * {
    box-sizing: border-box;
  }
  
  a {
    color: inherit;
    text-decoration: none;
  }

  body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@font-face {
  font-family: 'Inter';
  src: url('../public/font/Inter-VariableFont_slnt\,wght.ttf') format('truetype');
  font-weight: 100 900; /* Variable font weight range */
  font-style: normal;
  font-display: swap;
}

  
`;

export default GlobalStyle;
