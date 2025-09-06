// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { ConsoleLogger, MultiLogger, POSTLogger } from 'amazon-chime-sdk-js';
import { SDK_LOG_LEVELS } from './constants';
import { MeetingConfig } from './types';

// Helper function to safely access window/location in SSR
function getLogLevel(): any {
  if (typeof window === 'undefined') {
    return SDK_LOG_LEVELS.info; // Default log level for SSR
  }
  
  const urlParams = new URLSearchParams(window.location.search);
  const queryLogLevel = urlParams.get('logLevel') || 'info';
  return SDK_LOG_LEVELS[queryLogLevel as keyof typeof SDK_LOG_LEVELS] || SDK_LOG_LEVELS.info;
}

function createLogger(): ConsoleLogger | MultiLogger {
  const logLevel = getLogLevel();
  const baseLogger = new ConsoleLogger('ChimeComponentLibraryReactDemo', logLevel);
  
  if (typeof window === 'undefined') {
    return baseLogger;
  }
  
  const BASE_URL: string = [location.protocol, '//', location.host, location.pathname.replace(/\/*$/, '/')].join('');
  
  if (!['0.0.0.0', '127.0.0.1', 'localhost'].includes(location.hostname)) {
    const postLogger = new POSTLogger({
      url: `${BASE_URL}logs`,
      logLevel,
      metadata: {
        appName: 'ChimeComponentLibraryReactDemo',
        timestamp: Date.now().toString(), // Add current timestamp for unique AWS CloudWatch log stream generation. This will be unique per POSTLogger creation in time.
      },
    });
    const multiLogger = new MultiLogger(baseLogger, postLogger);
    (multiLogger as any).postLogger = postLogger; // Add postLogger reference
    return multiLogger;
  }
  
  return baseLogger;
}

const meetingConfig: MeetingConfig = {
  simulcastEnabled: false,
  logger: createLogger(),
};

export default meetingConfig;