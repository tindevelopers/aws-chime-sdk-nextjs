// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

// Simple in-memory cache for demo purposes
// In production, you'd want to use Redis, DynamoDB, or another persistent store

interface Meeting {
  MeetingId: string;
  ExternalMeetingId: string;
  MediaRegion: string;
  MediaPlacement: any;
  MeetingArn: string;
  TenantIds: string[];
}

interface Attendee {
  AttendeeId: string;
  ExternalUserId: string;
  Name: string;
  Capabilities?: any;
  JoinToken?: string;
}

// Global cache objects
declare global {
  var meetingCache: Record<string, Meeting> | undefined;
  var attendeeCache: Record<string, Record<string, Attendee>> | undefined;
}

// Initialize caches if they don't exist
if (!globalThis.meetingCache) {
  globalThis.meetingCache = {};
}

if (!globalThis.attendeeCache) {
  globalThis.attendeeCache = {};
}

export const meetingCache = globalThis.meetingCache;
export const attendeeCache = globalThis.attendeeCache;
