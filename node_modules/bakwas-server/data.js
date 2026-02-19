export const users = [
  {
    id: "u1",
    role: "guest",
    name: "Asha Verma",
    email: "asha@example.com",
    phone: "+91-90000-00001"
  },
  {
    id: "u2",
    role: "host",
    name: "Rohit Mehra",
    email: "rohit@example.com",
    phone: "+91-90000-00002"
  },
  {
    id: "u3",
    role: "admin",
    name: "Admin",
    email: "admin@example.com",
    phone: "+91-90000-00003"
  }
];

export const amenities = [
  "WiFi",
  "AC",
  "Parking",
  "TV",
  "Kitchen",
  "Pool",
  "Gym"
];

export const properties = [
  {
    id: "p1",
    name: "StayEase Downtown Loft",
    type: "Apartment",
    location: { city: "Bengaluru", state: "Karnataka", country: "India" },
    description: "Modern loft in the heart of the city with skyline views.",
    amenities: ["WiFi", "AC", "Kitchen"],
    pricePerNight: 3499,
    maxGuests: 3,
    rating: 4.6,
    hostId: "u2",
    images: [
      "https://picsum.photos/seed/room-101/800/500",
      "https://picsum.photos/seed/room-102/800/500",
      "https://picsum.photos/seed/room-103/800/500"
    ],
    availability: {
      checkIn: "14:00",
      checkOut: "11:00",
      blackoutDates: ["2026-02-10", "2026-02-12"]
    },
    status: "Active",
    bookingsThisMonth: 8
  },
  {
    id: "p2",
    name: "Roomify Sea Breeze Villa",
    type: "Villa",
    location: { city: "Goa", state: "Goa", country: "India" },
    description: "Coastal villa with private pool and garden seating.",
    amenities: ["WiFi", "Pool", "Parking"],
    pricePerNight: 7999,
    maxGuests: 6,
    rating: 4.8,
    hostId: "u2",
    images: [
      "https://picsum.photos/seed/room-201/800/500",
      "https://picsum.photos/seed/room-202/800/500",
      "https://picsum.photos/seed/room-203/800/500"
    ],
    availability: {
      checkIn: "15:00",
      checkOut: "11:00",
      blackoutDates: ["2026-02-08", "2026-02-09"]
    },
    status: "Active",
    bookingsThisMonth: 5
  },
  {
    id: "p3",
    name: "BookMyStay Heritage Hotel",
    type: "Hotel",
    location: { city: "Jaipur", state: "Rajasthan", country: "India" },
    description: "Heritage stay with rooftop dining and city views.",
    amenities: ["WiFi", "AC", "Parking", "TV"],
    pricePerNight: 4999,
    maxGuests: 2,
    rating: 4.3,
    hostId: "u2",
    images: [
      "https://picsum.photos/seed/room-301/800/500",
      "https://picsum.photos/seed/room-302/800/500",
      "https://picsum.photos/seed/room-303/800/500"
    ],
    availability: {
      checkIn: "13:00",
      checkOut: "10:30",
      blackoutDates: []
    },
    status: "Under review",
    bookingsThisMonth: 2
  }
];

export const bookings = [
  {
    id: "b1",
    propertyId: "p1",
    propertyName: "StayEase Downtown Loft",
    guestId: "u1",
    guestName: "Asha Verma",
    status: "Confirmed",
    checkInDate: "2026-02-15",
    checkOutDate: "2026-02-18",
    guests: 2,
    pricing: {
      base: 10497,
      taxes: 1260,
      platformFee: 420,
      total: 12177
    }
  },
  {
    id: "b2",
    propertyId: "p2",
    propertyName: "Roomify Sea Breeze Villa",
    guestId: "u1",
    guestName: "Asha Verma",
    status: "Pending",
    checkInDate: "2026-02-20",
    checkOutDate: "2026-02-23",
    guests: 4,
    pricing: {
      base: 23997,
      taxes: 2880,
      platformFee: 900,
      total: 27777
    }
  }
];

export const payments = [
  {
    id: "pay1",
    bookingId: "b1",
    method: "UPI",
    status: "Paid",
    amount: 12177,
    invoiceId: "INV-2026-0001"
  }
];

export const reviews = [
  {
    id: "r1",
    propertyId: "p1",
    guestId: "u1",
    rating: 5,
    text: "Super clean and perfect location. Loved the city view!",
    createdAt: "2026-01-28"
  },
  {
    id: "r2",
    propertyId: "p2",
    guestId: "u1",
    rating: 4,
    text: "Beautiful villa, pool was great. A bit far from the market.",
    createdAt: "2026-01-30"
  }
];

export const stats = {
  activeUsers: 4821,
  bookingsThisMonth: 932,
  revenueThisMonth: 6832140,
  averageRating: 4.5,
  platformUptime: "99.93%"
};

export const hostOverview = {
  totalListings: 3,
  upcomingBookings: 12,
  monthlyEarnings: 284530,
  platformFees: 19520,
  netPayout: 265010
};

export const adminOverview = {
  pendingHosts: 6,
  flaggedListings: 3,
  monthlyRevenue: 6832140,
  disputesResolved: 41,
  refundsIssued: 122300
};

export const approvals = [
  {
    id: "a1",
    name: "Lakeside Hostel",
    city: "Udaipur",
    type: "Hostel"
  },
  {
    id: "a2",
    name: "Palm Grove Suites",
    city: "Kochi",
    type: "Hotel"
  }
];
