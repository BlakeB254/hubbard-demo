'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Badge } from '@hubbard-inn/shared';
import { QRCode } from '../atoms/QRCode';
import { PriceTag } from '../atoms/PriceTag';
import { Calendar, MapPin, Ticket as TicketIcon } from 'lucide-react';

export interface TicketData {
  id: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  floorNumber: string;
  pricePaid: number;
  status: 'valid' | 'used' | 'refunded' | 'cancelled';
  qrCode: string;
  purchaseType: 'presale' | 'door';
}

export interface TicketCardProps {
  ticket: TicketData;
  showQR?: boolean;
}

export function TicketCard({ ticket, showQR = true }: TicketCardProps) {
  const [qrExpanded, setQrExpanded] = useState(false);

  const statusBadge = {
    valid: { variant: 'success' as const, text: 'Valid' },
    used: { variant: 'secondary' as const, text: 'Used' },
    refunded: { variant: 'destructive' as const, text: 'Refunded' },
    cancelled: { variant: 'destructive' as const, text: 'Cancelled' },
  }[ticket.status];

  const purchaseTypeBadge = {
    presale: { variant: 'default' as const, text: 'Presale' },
    door: { variant: 'outline' as const, text: 'Door' },
  }[ticket.purchaseType];

  return (
    <div className="bg-card rounded-phi-4 border border-border overflow-hidden shadow-md">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary p-phi-4 text-primary-foreground">
        <div className="flex items-start justify-between mb-phi-2">
          <div className="flex items-center gap-phi-2">
            <TicketIcon className="w-5 h-5" />
            <h3 className="font-semibold text-lg">{ticket.eventTitle}</h3>
          </div>
          <Badge variant={statusBadge.variant} className="bg-white/20 text-white border-white/30">
            {statusBadge.text}
          </Badge>
        </div>
        <div className="flex items-center gap-phi-3 text-sm opacity-90">
          <div className="flex items-center gap-phi-2">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(ticket.eventDate), 'PPP')}</span>
          </div>
          <div className="flex items-center gap-phi-2">
            <MapPin className="w-4 h-4" />
            <span>Floor {ticket.floorNumber}</span>
          </div>
        </div>
      </div>

      {/* Ticket Details */}
      <div className="p-phi-4">
        <div className="flex items-center justify-between mb-phi-4">
          <div>
            <p className="text-sm text-muted-foreground mb-phi-1">Amount Paid</p>
            <PriceTag amount={ticket.pricePaid} size="lg" />
          </div>
          <Badge variant={purchaseTypeBadge.variant}>{purchaseTypeBadge.text}</Badge>
        </div>

        {/* QR Code */}
        {showQR && ticket.status === 'valid' && (
          <div className="mt-phi-4 pt-phi-4 border-t border-border">
            <button
              onClick={() => setQrExpanded(!qrExpanded)}
              className="w-full text-center"
            >
              <div className="flex items-center justify-center mb-phi-3">
                <p className="text-sm font-medium text-foreground">
                  {qrExpanded ? 'Hide QR Code' : 'Show QR Code for Entry'}
                </p>
              </div>
            </button>

            {qrExpanded && (
              <div className="flex flex-col items-center">
                <div className="bg-white p-phi-3 rounded-phi-3 inline-block">
                  <QRCode value={ticket.qrCode} size={200} />
                </div>
                <p className="mt-phi-3 text-xs text-center text-muted-foreground">
                  Show this code at the venue entrance
                </p>
              </div>
            )}
          </div>
        )}

        {ticket.status === 'used' && (
          <div className="mt-phi-4 pt-phi-4 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              This ticket has been scanned and used
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
