import type { NextApiRequest, NextApiResponse } from 'next';
import { getRecentEvents } from '../webhooks/chainhook';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const events = getRecentEvents(limit);

    return res.status(200).json({
      success: true,
      events,
      count: events.length,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error fetching recent events:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
