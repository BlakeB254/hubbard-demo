import { Router } from 'express';

const router = Router();

// GET /api/admin/stats
router.get('/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      totalRevenue: 125000,
      ticketsSold: 450,
      activeEvents: 8,
      activePromoters: 15,
    },
  });
});

// GET /api/admin/events
router.get('/events', (req, res) => {
  res.json({
    success: true,
    data: [],
  });
});

// POST /api/admin/events
router.post('/events', (req, res) => {
  res.json({
    success: true,
    data: { id: `EVT-${Date.now()}`, ...req.body },
  });
});

// GET /api/admin/promoters
router.get('/promoters', (req, res) => {
  res.json({
    success: true,
    data: [],
  });
});

// GET /api/admin/analytics
router.get('/analytics', (req, res) => {
  res.json({
    success: true,
    data: {
      revenue: [],
      tickets: [],
      topEvents: [],
    },
  });
});

// POST /api/admin/check-in/validate
router.post('/check-in/validate', (req, res) => {
  const { qrCode } = req.body;

  res.json({
    success: true,
    data: {
      valid: true,
      ticketId: qrCode,
      eventName: 'Summer Rooftop Party',
      guestName: 'John Doe',
      message: 'Ticket validated successfully',
    },
  });
});

export { router as adminRoutes };
