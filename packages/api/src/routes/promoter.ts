import { Router } from 'express';

const router = Router();

// GET /api/promoter/stats
router.get('/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      totalClicks: 1250,
      totalConversions: 85,
      totalRevenue: 8500,
      pendingPayout: 425,
      conversionRate: 6.8,
    },
  });
});

// GET /api/promoter/events
router.get('/events', (req, res) => {
  res.json({
    success: true,
    data: [],
  });
});

// GET /api/promoter/links
router.get('/links', (req, res) => {
  res.json({
    success: true,
    data: [],
  });
});

// GET /api/promoter/links/:id
router.get('/links/:id', (req, res) => {
  res.json({
    success: true,
    data: {
      id: req.params.id,
      code: 'PROMO123',
      url: 'https://hubbardinn.com/e/1?ref=PROMO123',
      clicks: 450,
      conversions: 32,
      revenue: 3200,
      isActive: true,
    },
  });
});

// POST /api/promoter/links
router.post('/links', (req, res) => {
  const { eventId, customCode } = req.body;

  res.json({
    success: true,
    data: {
      id: `LNK-${Date.now()}`,
      eventId,
      code: customCode || `PROMO${Date.now()}`,
      url: `https://hubbardinn.com/e/${eventId}?ref=${customCode || Date.now()}`,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      isActive: true,
    },
  });
});

// GET /api/promoter/conversions
router.get('/conversions', (req, res) => {
  res.json({
    success: true,
    data: [],
  });
});

// GET /api/promoter/earnings
router.get('/earnings', (req, res) => {
  res.json({
    success: true,
    data: {
      totalEarnings: 8500,
      pendingPayout: 425,
      byEvent: [],
    },
  });
});

export { router as promoterRoutes };
