import { Router } from 'express';
import { authenticateRequest } from '../middleware/auth.js';

const router = Router();

/**
 * Customer Routes
 * Public routes for browsing, authenticated routes for purchasing
 */

// Event Discovery (Public)
router.get('/events', async (req, res) => {
  // TODO: List upcoming events (public)
  res.status(501).json({ message: 'List events - Not implemented yet' });
});

router.get('/events/:id', async (req, res) => {
  // TODO: Get event details (public)
  res.status(501).json({ message: 'Get event details - Not implemented yet' });
});

// Ticket Purchase (Guest or Authenticated)
// IMPORTANT: Authentication is OPTIONAL - supports guest checkout
router.post('/tickets/purchase', async (req, res) => {
  // TODO: Buy ticket(s)
  // Support both authenticated users and guest checkout
  // For guests: require email in request body for order confirmation
  res.status(501).json({ message: 'Purchase tickets - Not implemented yet' });
});

router.get('/tickets/my-tickets', authenticateRequest, async (req, res) => {
  // TODO: Get user's tickets (authenticated users only)
  res.status(501).json({ message: 'Get my tickets - Not implemented yet' });
});

// Guest Order Lookup (No Authentication Required)
router.get('/orders/lookup', async (req, res) => {
  // TODO: Lookup order by email + order number for guests
  res.status(501).json({ message: 'Guest order lookup - Not implemented yet' });
});

router.get('/tickets/:id/qr', authenticateRequest, async (req, res) => {
  // TODO: Generate QR code for ticket
  res.status(501).json({ message: 'Get ticket QR code - Not implemented yet' });
});

// Section/Bottle Service (Guest or Authenticated)
// IMPORTANT: Authentication is OPTIONAL - supports guest reservations
router.post('/sections/reserve', async (req, res) => {
  // TODO: Reserve VIP section
  // Support both authenticated users and guest reservations
  // For guests: require contact info in request body
  res.status(501).json({ message: 'Reserve section - Not implemented yet' });
});

router.get('/sections/:eventId', async (req, res) => {
  // TODO: Get available sections for event
  res.status(501).json({ message: 'Get available sections - Not implemented yet' });
});

// Loyalty Program (Authenticated)
router.get('/profile/loyalty', authenticateRequest, async (req, res) => {
  // TODO: Get loyalty points
  res.status(501).json({ message: 'Get loyalty points - Not implemented yet' });
});

export { router as customerRoutes };
