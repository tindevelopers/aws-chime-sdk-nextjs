// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { NextApiRequest, NextApiResponse } from 'next';
import { attendeeCache } from '../../src/utils/cache';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, attendeeId } = req.query;

    if (!title || !attendeeId || typeof title !== 'string' || typeof attendeeId !== 'string') {
      return res.status(400).json({ error: 'Missing required query parameters: title and attendeeId' });
    }

    const attendee = attendeeCache[title]?.[attendeeId];
    
    if (!attendee) {
      return res.status(404).json({ error: 'Attendee not found' });
    }

    res.status(200).json(attendee);
  } catch (err: any) {
    console.error(`Error getting attendee information: ${err.message}`);
    res.status(403).json({ error: err.message });
  }
}
