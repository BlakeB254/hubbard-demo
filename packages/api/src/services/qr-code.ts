import QRCode from 'qrcode';
import { TOTP } from 'otpauth';
import crypto from 'crypto';
import { db } from '../db/db.js';
import { tickets } from '../db/schema/index.js';
import { eq } from 'drizzle-orm';

/**
 * QR Code Service
 * Generates and validates time-based QR codes for ticket security
 */
export class QRCodeService {
  /**
   * Generate unique, time-based QR code for ticket
   * Uses TOTP (Time-based One-Time Password) for security
   */
  static async generateTicketQR(ticketId: string, userId: string): Promise<{
    qrCodeDataUrl: string;
    qrSecret: string;
  }> {
    // Create unique secret for this ticket
    const secret = crypto.randomBytes(32).toString('hex');

    // Create TOTP token (valid for 30 seconds)
    const totp = new TOTP({
      issuer: 'HubbardInn',
      label: ticketId,
      algorithm: 'SHA1',
      digits: 8,
      period: 30, // 30-second validity window
      secret,
    });

    const token = totp.generate();

    // Encode ticket data
    const qrData = JSON.stringify({
      ticketId,
      userId,
      token,
      timestamp: Date.now(),
      version: '1.0',
    });

    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'H', // High error correction for phone screens
      type: 'image/png',
      margin: 2,
      width: 400,
    });

    return {
      qrCodeDataUrl,
      qrSecret: secret,
    };
  }

  /**
   * Validate QR code at entry
   * Checks ticket validity, prevents duplicate entry, and verifies TOTP token
   */
  static async validateTicketQR(qrData: string): Promise<{
    valid: boolean;
    message: string;
    ticketId?: string;
  }> {
    try {
      const data = JSON.parse(qrData);
      const { ticketId, userId, token, timestamp } = data;

      // Basic data validation
      if (!ticketId || !userId || !token) {
        return { valid: false, message: 'Invalid QR code format' };
      }

      // Check if QR is too old (prevent replay attacks beyond TOTP window)
      const qrAge = Date.now() - timestamp;
      const MAX_QR_AGE = 5 * 60 * 1000; // 5 minutes

      if (qrAge > MAX_QR_AGE) {
        return { valid: false, message: 'QR code expired - please refresh' };
      }

      // Fetch ticket from database
      const [ticket] = await db
        .select()
        .from(tickets)
        .where(eq(tickets.id, ticketId))
        .limit(1);

      if (!ticket) {
        return { valid: false, message: 'Ticket not found' };
      }

      // Check if ticket is valid status
      if (ticket.status !== 'valid') {
        return {
          valid: false,
          message: `Ticket status: ${ticket.status}`,
        };
      }

      // Check if already scanned
      if (ticket.isScanned) {
        return {
          valid: false,
          message: `Already scanned at ${ticket.scannedAt?.toLocaleString()}`,
        };
      }

      // Verify user ID matches
      if (ticket.customerId !== userId) {
        return { valid: false, message: 'Ticket user mismatch' };
      }

      // Verify TOTP token
      const totp = new TOTP({
        issuer: 'HubbardInn',
        label: ticketId,
        algorithm: 'SHA1',
        digits: 8,
        period: 30,
        secret: ticket.qrSecret,
      });

      // Allow 1 period before/after current time (90-second total window)
      const delta = totp.validate({ token, window: 1 });

      if (delta === null) {
        return {
          valid: false,
          message: 'QR code validation failed - please refresh',
        };
      }

      return {
        valid: true,
        message: 'Ticket validated successfully',
        ticketId,
      };
    } catch (error) {
      console.error('QR validation error:', error);
      return { valid: false, message: 'Invalid QR code format' };
    }
  }

  /**
   * Mark ticket as scanned
   * Called after successful validation to prevent re-entry
   */
  static async markTicketAsScanned(
    ticketId: string,
    scannedBy: string
  ): Promise<boolean> {
    try {
      await db
        .update(tickets)
        .set({
          isScanned: true,
          scannedAt: new Date(),
          scannedBy,
        })
        .where(eq(tickets.id, ticketId));

      return true;
    } catch (error) {
      console.error('Error marking ticket as scanned:', error);
      return false;
    }
  }
}
