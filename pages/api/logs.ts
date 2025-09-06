// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Received logs in Vercel serverless function');
    console.log('Log data:', req.body);
    
    res.status(200).json({ message: 'Logs received successfully' });
  } catch (err: any) {
    console.error(`Error processing logs: ${err.message}`);
    res.status(500).json({ error: 'Error processing logs' });
  }
}
