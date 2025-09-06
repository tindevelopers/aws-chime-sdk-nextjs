import type { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import { 
  MeetingProvider,
  NotificationProvider,
  GlobalStyles,
  LoggerProvider,
  VoiceFocusProvider,
} from 'amazon-chime-sdk-component-library-react';
import { VoiceFocusModelName } from 'amazon-chime-sdk-js';
import { ErrorProvider } from '../src/providers/ErrorProvider';
import { AppStateProvider, useAppState } from '../src/providers/AppStateProvider';
import { NavigationProvider } from '../src/providers/NavigationProvider';
import { demoLightTheme, demoDarkTheme } from '../src/theme/demoTheme';
import Notifications from '../src/containers/Notifications';
import meetingConfig from '../src/meetingConfig';
import '../src/style.css';

function VoiceFocusWrapper({ children }: { children: React.ReactNode }) {
  const { joinInfo } = useAppState();

  function voiceFocusName(name: string): VoiceFocusModelName {
    if (name && ['default', 'ns_es'].includes(name)) {
      return name as VoiceFocusModelName;
    }
    return 'default';
  }

  function getVoiceFocusSpecName(): VoiceFocusModelName {
    if (joinInfo && joinInfo.Meeting?.MeetingFeatures?.Audio?.EchoReduction === 'AVAILABLE') {
      return voiceFocusName('ns_es');
    }
    return voiceFocusName('default');
  }

  const vfConfigValue = {
    spec: { name: getVoiceFocusSpecName() },
    createMeetingResponse: joinInfo,
  };

  return (
    <VoiceFocusProvider {...vfConfigValue}>
      {children}
    </VoiceFocusProvider>
  );
}

function Theme({ children }: { children: React.ReactNode }) {
  const { theme } = useAppState();

  return (
    <ThemeProvider theme={theme === 'light' ? demoLightTheme : demoDarkTheme}>
      <GlobalStyles />
      {children}
    </ThemeProvider>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LoggerProvider logger={meetingConfig.logger}>
      <AppStateProvider>
        <VoiceFocusWrapper>
          <Theme>
            <NotificationProvider>
              <Notifications />
              <ErrorProvider>
                <MeetingProvider>
                  <NavigationProvider>
                    <Component {...pageProps} />
                  </NavigationProvider>
                </MeetingProvider>
              </ErrorProvider>
            </NotificationProvider>
          </Theme>
        </VoiceFocusWrapper>
      </AppStateProvider>
    </LoggerProvider>
  );
}
