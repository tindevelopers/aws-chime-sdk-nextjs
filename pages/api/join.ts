// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { NextApiRequest, NextApiResponse } from 'next';
import { ChimeSDKMeetings } from '@aws-sdk/client-chime-sdk-meetings';
import { v4 as uuidv4 } from 'uuid';
import { meetingCache, attendeeCache } from '../../src/utils/cache';

// Initialize Chime SDK client
const chimeSDKMeetings = new ChimeSDKMeetings({ 
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  }
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, attendeeName, region = 'us-east-1', ns_es } = req.body;

    if (!title || !attendeeName) {
      return res.status(400).json({ error: 'Missing required fields: title and attendeeName' });
    }

    // Create meeting if it doesn't exist
    if (!meetingCache[title]) {
      const { Meeting } = await chimeSDKMeetings.createMeeting({
        ClientRequestToken: uuidv4(),
        MediaRegion: region,
        ExternalMeetingId: title.substring(0, 64),
        MeetingFeatures: ns_es === 'true' ? { Audio: { EchoReduction: 'AVAILABLE' } } : undefined,
      });

      if (!Meeting) {
        return res.status(500).json({ error: 'Failed to create meeting' });
      }

      meetingCache[title] = Meeting;
      attendeeCache[title] = {};
    }

    // Create attendee
    const { Attendee } = await chimeSDKMeetings.createAttendee({
      MeetingId: meetingCache[title].MeetingId,
      ExternalUserId: uuidv4(),
    });

    attendeeCache[title][Attendee.AttendeeId] = { ...Attendee, Name: attendeeName };

    const joinInfo = {
      JoinInfo: {
        Title: title,
        Meeting: meetingCache[title],
        Attendee: attendeeCache[title][Attendee.AttendeeId],
      },
    };

    res.status(201).json(joinInfo);
  } catch (err: any) {
    console.error(`Error creating/joining meeting: ${err.message}`);
    res.status(403).json({ error: err.message });
  }
}
