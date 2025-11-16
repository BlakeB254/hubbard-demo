import type {
  PromoterDashboardStats,
  PromoterLink,
  Event,
  Analytics,
  EarningsData
} from '@hubbard-inn/shared';

// Mock dashboard stats
export const mockStats: PromoterDashboardStats = {
  totalClicks: 1247,
  totalConversions: 78,
  totalRevenue: 156000, // $1,560.00 in cents
  totalEarnings: 15600, // $156.00 in cents
  activeLinks: 5,
  conversionRate: 6.25,
};

// Mock events available for promotion
export const mockEvents: Event[] = [
  {
    id: 'evt_1',
    title: 'Summer Jazz Night',
    description: 'An evening of smooth jazz with local artists',
    eventDate: new Date('2025-12-15T20:00:00').toISOString(),
    startTime: '20:00',
    endTime: '02:00',
    venueId: 'venue_1',
    floorNumber: '3' as const,
    totalCapacity: 200,
    capacity: 200,
    ticketsSold: 87,
    ageRestriction: '21+' as const,
    coverPrice: 3500, // $35.00
    presaleEnabled: true,
    doorSalesEnabled: true,
    affiliateCommissionEnabled: true,
    affiliateCommissionAmount: 350, // $3.50
    status: 'published' as const,
    createdBy: 'admin_1',
    createdAt: new Date('2025-11-01').toISOString(),
    updatedAt: new Date('2025-11-10').toISOString(),
  },
  {
    id: 'evt_2',
    title: 'Comedy Open Mic',
    description: 'Local comedians showcase their best material',
    eventDate: new Date('2025-12-20T21:00:00').toISOString(),
    startTime: '21:00',
    endTime: '23:30',
    venueId: 'venue_1',
    floorNumber: '2' as const,
    totalCapacity: 150,
    capacity: 150,
    ticketsSold: 45,
    ageRestriction: '18+' as const,
    coverPrice: 2000, // $20.00
    presaleEnabled: true,
    doorSalesEnabled: true,
    affiliateCommissionEnabled: true,
    affiliateCommissionAmount: 300, // $3.00
    status: 'published' as const,
    createdBy: 'admin_1',
    createdAt: new Date('2025-11-05').toISOString(),
    updatedAt: new Date('2025-11-12').toISOString(),
  },
  {
    id: 'evt_3',
    title: 'New Year\'s Eve Bash',
    description: 'Ring in the new year with live music and champagne',
    eventDate: new Date('2025-12-31T22:00:00').toISOString(),
    startTime: '22:00',
    endTime: '02:00',
    venueId: 'venue_1',
    floorNumber: '1' as const,
    totalCapacity: 300,
    capacity: 300,
    ticketsSold: 156,
    ageRestriction: '21+' as const,
    coverPrice: 8500, // $85.00
    presaleEnabled: true,
    doorSalesEnabled: true,
    affiliateCommissionEnabled: true,
    affiliateCommissionAmount: 1000, // $10.00
    status: 'published' as const,
    createdBy: 'admin_1',
    createdAt: new Date('2025-10-15').toISOString(),
    updatedAt: new Date('2025-11-14').toISOString(),
  },
];

// Mock promoter links
export const mockLinks: PromoterLink[] = [
  {
    id: 'link_1',
    promoterId: 'promoter_1',
    eventId: 'evt_1',
    uniqueCode: 'JAZZ2025',
    url: 'https://hubbardinn.com/events/evt_1?promo=JAZZ2025',
    clicks: 342,
    conversions: 28,
    revenueGenerated: 98000, // $980.00
    commission: 9800, // $98.00
    isActive: true,
    createdAt: new Date('2025-11-05').toISOString(),
    updatedAt: new Date('2025-11-05').toISOString(),
    expiresAt: new Date('2025-12-15').toISOString(),
  },
  {
    id: 'link_2',
    promoterId: 'promoter_1',
    eventId: 'evt_2',
    uniqueCode: 'COMEDY20',
    url: 'https://hubbardinn.com/events/evt_2?promo=COMEDY20',
    clicks: 156,
    conversions: 12,
    revenueGenerated: 24000, // $240.00
    commission: 3600, // $36.00
    isActive: true,
    createdAt: new Date('2025-11-08').toISOString(),
    updatedAt: new Date('2025-11-08').toISOString(),
    expiresAt: new Date('2025-12-20').toISOString(),
  },
  {
    id: 'link_3',
    promoterId: 'promoter_1',
    eventId: 'evt_3',
    uniqueCode: 'NYE2025',
    url: 'https://hubbardinn.com/events/evt_3?promo=NYE2025',
    clicks: 623,
    conversions: 31,
    revenueGenerated: 263500, // $2,635.00
    commission: 31620, // $316.20
    isActive: true,
    createdAt: new Date('2025-10-20').toISOString(),
    updatedAt: new Date('2025-10-20').toISOString(),
    expiresAt: new Date('2025-12-31').toISOString(),
  },
  {
    id: 'link_4',
    promoterId: 'promoter_1',
    eventId: 'evt_1',
    uniqueCode: 'JAZZFAN',
    url: 'https://hubbardinn.com/events/evt_1?promo=JAZZFAN',
    clicks: 89,
    conversions: 5,
    revenueGenerated: 17500, // $175.00
    commission: 1750, // $17.50
    isActive: true,
    createdAt: new Date('2025-11-10').toISOString(),
    updatedAt: new Date('2025-11-10').toISOString(),
    expiresAt: new Date('2025-12-15').toISOString(),
  },
  {
    id: 'link_5',
    promoterId: 'promoter_1',
    eventId: 'evt_2',
    uniqueCode: 'LAUGH23',
    url: 'https://hubbardinn.com/events/evt_2?promo=LAUGH23',
    clicks: 37,
    conversions: 2,
    revenueGenerated: 4000, // $40.00
    commission: 600, // $6.00
    isActive: false,
    createdAt: new Date('2025-11-06').toISOString(),
    updatedAt: new Date('2025-11-06').toISOString(),
    expiresAt: new Date('2025-12-20').toISOString(),
  },
];

// Mock link analytics with time series data
export const mockLinkAnalytics = (linkId: string): Analytics & {
  clicksOverTime: Array<{ date: string; clicks: number; conversions: number }>;
  deviceBreakdown: Array<{ device: string; clicks: number; percentage: number }>;
  recentConversions: Array<{ date: string; tickets: number; revenue: number; commission: number }>;
} => {
  const link = mockLinks.find(l => l.id === linkId);
  if (!link) {
    throw new Error('Link not found');
  }

  // Generate time series data for the last 30 days
  const clicksOverTime = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split('T')[0],
      clicks: Math.floor(Math.random() * 20) + 5,
      conversions: Math.floor(Math.random() * 3),
    };
  });

  return {
    id: `analytics_${linkId}`,
    linkId,
    totalClicks: link.clicks,
    uniqueClicks: Math.floor(link.clicks * 0.85),
    totalConversions: link.conversions,
    conversionRate: (link.conversions / link.clicks) * 100,
    revenueGenerated: link.revenueGenerated,
    commission: link.commission,
    avgOrderValue: link.revenueGenerated / link.conversions,
    clicksOverTime,
    deviceBreakdown: [
      { device: 'Mobile', clicks: Math.floor(link.clicks * 0.62), percentage: 62 },
      { device: 'Desktop', clicks: Math.floor(link.clicks * 0.28), percentage: 28 },
      { device: 'Tablet', clicks: Math.floor(link.clicks * 0.10), percentage: 10 },
    ],
    recentConversions: Array.from({ length: link.conversions > 10 ? 10 : link.conversions }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const tickets = Math.floor(Math.random() * 3) + 1;
      const revenue = tickets * (link.revenueGenerated / link.conversions);
      const event = mockEvents.find(e => e.id === link.eventId);
      const commissionRate = (event?.promoterCommission || 10) / 100;

      return {
        date: date.toISOString(),
        tickets,
        revenue: Math.floor(revenue),
        commission: Math.floor(revenue * commissionRate),
      };
    }),
  };
};

// Mock earnings data
export const mockEarningsData: EarningsData = {
  totalEarnings: 47420, // $474.20
  currentMonth: 15600, // $156.00
  pending: 8900, // $89.00
  paid: 38520, // $385.20
  monthlyEarnings: Array.from({ length: 12 }, (_, i) => {
    const month = new Date();
    month.setMonth(month.getMonth() - (11 - i));
    return {
      month: month.toISOString().split('T')[0].substring(0, 7), // YYYY-MM
      earnings: Math.floor(Math.random() * 20000) + 5000, // $50-$250
    };
  }),
  history: [
    {
      id: 'txn_1',
      date: new Date('2025-11-14').toISOString(),
      eventTitle: 'New Year\'s Eve Bash',
      eventId: 'evt_3',
      ticketsSold: 5,
      revenue: 42500, // $425.00
      commission: 5100, // $51.00
      status: 'pending' as const,
    },
    {
      id: 'txn_2',
      date: new Date('2025-11-12').toISOString(),
      eventTitle: 'Summer Jazz Night',
      eventId: 'evt_1',
      ticketsSold: 3,
      revenue: 10500, // $105.00
      commission: 1050, // $10.50
      status: 'pending' as const,
    },
    {
      id: 'txn_3',
      date: new Date('2025-11-10').toISOString(),
      eventTitle: 'Comedy Open Mic',
      eventId: 'evt_2',
      ticketsSold: 2,
      revenue: 4000, // $40.00
      commission: 600, // $6.00
      status: 'paid' as const,
    },
    {
      id: 'txn_4',
      date: new Date('2025-11-08').toISOString(),
      eventTitle: 'New Year\'s Eve Bash',
      eventId: 'evt_3',
      ticketsSold: 8,
      revenue: 68000, // $680.00
      commission: 8160, // $81.60
      status: 'paid' as const,
    },
    {
      id: 'txn_5',
      date: new Date('2025-11-05').toISOString(),
      eventTitle: 'Summer Jazz Night',
      eventId: 'evt_1',
      ticketsSold: 4,
      revenue: 14000, // $140.00
      commission: 1400, // $14.00
      status: 'paid' as const,
    },
  ],
};

// Mock recent conversions for dashboard
export const mockRecentConversions = mockEarningsData.history.slice(0, 5).map(item => ({
  id: item.id,
  linkId: mockLinks.find(l => l.eventId === item.eventId)?.id || 'link_1',
  eventTitle: item.eventTitle,
  amount: item.revenue,
  commission: item.commission,
  timestamp: item.date,
  tickets: item.ticketsSold,
}));
