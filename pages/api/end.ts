// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { NextApiRequest, NextApiResponse } from 'next';
import { ChimeSDKMeetings } from '@aws-sdk/client-chime-sdk-meetings';
import { meetingCache } from '../../src/utils/cache';

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
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Missing required field: title' });
    }

    if (!meetingCache[title]) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    await chimeSDKMeetings.deleteMeeting({
      MeetingId: meetingCache[title].MeetingId,
    });

    // Clean up cache
    delete meetingCache[title];

    res.status(200).json({ message: 'Meeting ended successfully' });
  } catch (err: any) {
    console.error(`Error ending meeting: ${err.message}`);
    res.status(403).json({ error: err.message });
  }
}
