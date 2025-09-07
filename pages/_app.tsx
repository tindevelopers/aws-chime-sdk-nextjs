import type { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import { 
  lightTheme,
  GlobalStyles,
  NotificationProvider,
  BackgroundBlurProvider 
} from 'amazon-chime-sdk-component-library-react';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={lightTheme}>
      <GlobalStyles />
      <NotificationProvider>
        <BackgroundBlurProvider>
          <Component {...pageProps} />
        </BackgroundBlurProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}