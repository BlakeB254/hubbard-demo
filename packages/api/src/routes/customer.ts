import { Router } from 'express';
import type { Event } from '@hubbard-inn/shared/types';

const router = Router();

// Mock data for demonstration
const mockEvents: Event[] = [
  {
    id: '1',
    name: 'Summer Rooftop Party',
    description: 'Join us for an unforgettable night under the stars at our rooftop venue.',
    date: '2025-06-15',
    startTime: '21:00',
    endTime: '02:00',
    floor: 'rooftop',
    status: 'published',
    presalePrice: 25,
    doorPrice: 35,
    capacity: 200,
    ticketsSold: 145,
    ageRestriction: '21+',
    salesMode: 'both',
    affiliateCommission: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Jazz Night',
    description: 'Experience live jazz in our intimate main floor setting.',
    date: '2025-06-20',
    startTime: '20:00',
    endTime: '01:00',
    floor: 'main',
    status: 'published',
    presalePrice: 20,
    doorPrice: 30,
    capacity: 150,
    ticketsSold: 80,
    ageRestriction: '21+',
    salesMode: 'presale',
    affiliateCommission: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// GET /api/customer/events
router.get('/events', (req, res) => {
  const { floor, limit } = req.query;
  let events = mockEvents;

  if (floor) {
    events = events.filter((e) => e.floor === floor);
  }

  if (limit) {
    events = events.slice(0, Number(limit));
  }

  res.json({
    success: true,
    data: events,
  });
});

// GET /api/customer/events/:id
router.get('/events/:id', (req, res) => {
  const event = mockEvents.find((e) => e.id === req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Event not found' },
    });
  }

  res.json({
    success: true,
    data: event,
  });
});

// POST /api/customer/tickets/purchase
router.post('/tickets/purchase', (req, res) => {
  const { eventId, quantity, type, affiliateCode } = req.body;

  // Mock response
  res.json({
    success: true,
    data: {
      orderId: `ORD-${Date.now()}`,
      tickets: Array.from({ length: quantity }, (_, i) => ({
        id: `TKT-${Date.now()}-${i}`,
        eventId,
        type,
        qrCode: `QR-${Date.now()}-${i}`,
      })),
    },
  });
});

// GET /api/customer/orders/:orderNumber
router.get('/orders/:orderNumber', (req, res) => {
  // Mock response
  res.json({
    success: true,
    data: {
      orderNumber: req.params.orderNumber,
      status: 'confirmed',
      tickets: [],
    },
  });
});

export { router as customerRoutes };
