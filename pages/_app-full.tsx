import type { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import { 
  MeetingProvider,
  NotificationProvider,
  GlobalStyles,
  LoggerProvider,
} from 'amazon-chime-sdk-component-library-react';
import { ErrorProvider } from '../src/providers/ErrorProvider';
import { AppStateProvider, useAppState } from '../src/providers/AppStateProvider';
import { NavigationProvider } from '../src/providers/NavigationProvider';
import { demoLightTheme, demoDarkTheme } from '../src/theme/demoTheme';
import Notifications from '../src/containers/Notifications';
import meetingConfig from '../src/meetingConfig';
import '../src/style.css';

function AppContent({ Component, pageProps }: AppProps) {
  const { theme } = useAppState();
  
  return (
    <ThemeProvider theme={theme === 'light' ? demoLightTheme : demoDarkTheme}>
      <GlobalStyles />
      <Notifications />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorProvider>
      <LoggerProvider logger={meetingConfig.logger}>
        <MeetingProvider>
          <NotificationProvider>
            <AppStateProvider>
              <NavigationProvider>
                <AppContent Component={Component} pageProps={pageProps} />
              </NavigationProvider>
            </AppStateProvider>
          </NotificationProvider>
        </MeetingProvider>
      </LoggerProvider>
    </ErrorProvider>
  );
}