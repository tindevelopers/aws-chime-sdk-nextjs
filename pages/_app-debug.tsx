import type { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import { ErrorProvider } from '../src/providers/ErrorProvider';
import { demoLightTheme } from '../src/theme/demoTheme';
import '../src/style.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorProvider>
      <ThemeProvider theme={demoLightTheme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </ErrorProvider>
  );
}
