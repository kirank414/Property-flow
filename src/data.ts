/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Property, MaintenanceRequest, Amenity, Booking, ActivityLog } from './types';

// Predefined Demo Users
export const demoUsers: User[] = [
  {
    id: 'u-1',
    name: 'Michael Chang',
    email: 'michael.c@propertyflow.com',
    role: 'Manager',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    phone: '+1 (555) 342-9988',
  },
  {
    id: 'u-2',
    name: 'Elena Rostova',
    email: 'elena.r@summitresidences.com',
    role: 'Tenant',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    phone: '+1 (555) 831-2339',
    unit: 'Unit 4B',
    propertyId: 'p-1',
  },
  {
    id: 'u-3',
    name: 'David Miller',
    email: 'david.m@propertyflow-service.com',
    role: 'Staff',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    phone: '+1 (555) 902-1212',
  },
  {
    id: 'u-4',
    name: 'Sarah Jenkins',
    email: 'sarah.j@propertyflow.com',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    phone: '+1 (555) 438-2321',
  }
];

// Predefined Properties
export const sampleProperties: Property[] = [
  {
    id: 'p-1',
    name: 'Summit Heights Residences',
    address: '742 Platinum Boulevard, Seattle, WA',
    type: 'Residential',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
    units: 124,
    occupancyRate: 98,
    activeRequests: 4,
    amenities: ['Skyline Pool', 'Elite Gymnastics Club', 'Business Lounge'],
    ownerName: 'Vanguard Realty Group',
    revenue: 184500
  },
  {
    id: 'p-2',
    name: 'The Grid Tech Hub',
    address: '101 Cybernetic Way, San Francisco, CA',
    type: 'Mixed-Use',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
    units: 45,
    occupancyRate: 91,
    activeRequests: 2,
    amenities: ['Conference Forum', 'Roof Lounge', 'Central Dining Hall'],
    ownerName: 'Apex Prime Properties',
    revenue: 310000
  },
  {
    id: 'p-3',
    name: 'Bella Vista Apartments',
    address: '293 Ocean Drive, Miami, FL',
    type: 'Residential',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
    units: 180,
    occupancyRate: 95,
    activeRequests: 7,
    amenities: ['Tropic Lagoon Pool', 'Wellness Spa', 'Private Marina Deck'],
    ownerName: 'Sol Line Ventures',
    revenue: 262000
  },
  {
    id: 'p-4',
    name: 'Stonebridge Creative Lofts',
    address: '58 Artisans Row, Austin, TX',
    type: 'Commercial',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
    units: 60,
    occupancyRate: 88,
    activeRequests: 3,
    amenities: ['Creative Workshop', 'Interactive Courtyard'],
    ownerName: 'Metropolitan Arts Ltd',
    revenue: 142000
  }
];

// Predefined Maintenance Requests
export const sampleRequests: MaintenanceRequest[] = [
  {
    id: 'REQ-1092',
    title: 'Water pressure fluctuation in master bath',
    description: 'The master suite bathroom shower is experiencing sudden drops in water pressure coupled with temp shifts. Started last Thursday.',
    propertyId: 'p-1',
    propertyName: 'Summit Heights Residences',
    unit: 'Unit 4B',
    category: 'Plumbing',
    priority: 'Medium',
    status: 'In Progress',
    createdBy: 'Elena Rostova',
    createdById: 'u-2',
    assignedTo: 'David Miller',
    assignedToId: 'u-3',
    createdAt: '2026-06-07T09:14:00Z',
    updatedAt: '2026-06-08T14:30:00Z',
    timeline: [
      {
        status: 'Pending',
        note: 'Request registered by Elena Rostova',
        timestamp: '2026-06-07T09:14:00Z',
        user: 'Elena Rostova'
      },
      {
        status: 'Assigned',
        note: 'Ticket delegated to Senior Plumber David Miller',
        timestamp: '2026-06-07T11:45:00Z',
        user: 'Michael Chang'
      },
      {
        status: 'In Progress',
        note: 'Solenoid pressure valve checked - order placed for replacement gasket',
        timestamp: '2026-06-08T14:30:00Z',
        user: 'David Miller'
      }
    ],
    comments: [
      {
        id: 'c-1',
        author: 'David Miller',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        role: 'Staff',
        content: 'I verified the main intake manifold for Unit 4B. The main line pressure is solid at 52 PSI, but the mixing valve cartridge contains minor calcium build-up. I will return tomorrow with a replacement cartridge to resolve this.',
        timestamp: '2026-06-08T14:32:00Z'
      },
      {
        id: 'c-2',
        author: 'Elena Rostova',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        role: 'Tenant',
        content: 'Thank you! Let me know when you arrive so I can make sure someone is at home to let you in.',
        timestamp: '2026-06-08T16:05:00Z'
      }
    ]
  },
  {
    id: 'REQ-1093',
    title: 'AC blower unit making metallic grinding sound',
    description: 'Heavy grinding noises start whenever the air conditioning cycle begins. System fails to blow cool air consistently. Thermostat set to 71F but ambient temp is 76F.',
    propertyId: 'p-1',
    propertyName: 'Summit Heights Residences',
    unit: 'Penthouse A',
    category: 'HVAC',
    priority: 'Urgent',
    status: 'Assigned',
    createdBy: 'Jonathan Vance',
    createdById: 'u-unlisted-1',
    assignedTo: 'David Miller',
    assignedToId: 'u-3',
    createdAt: '2026-06-08T18:40:00Z',
    updatedAt: '2026-06-08T19:00:00Z',
    timeline: [
      {
        status: 'Pending',
        note: 'Urgent HVAC concern submitted',
        timestamp: '2026-06-08T18:40:00Z',
        user: 'Jonathan Vance'
      },
      {
        status: 'Assigned',
        note: 'Assigned and flagged as high priority',
        timestamp: '2026-06-08T19:00:00Z',
        user: 'Michael Chang'
      }
    ],
    comments: []
  },
  {
    id: 'REQ-1094',
    title: 'Corridor emergency backup lights unresponsive',
    description: 'Third floor east corridor exit lighting has battery failure. Testing button receives no light output response.',
    propertyId: 'p-3',
    propertyName: 'Bella Vista Apartments',
    unit: 'Common Hallways',
    category: 'Electrical',
    priority: 'High',
    status: 'Pending',
    createdBy: 'Staff Inspector',
    createdById: 'u-3',
    createdAt: '2026-06-09T02:30:00Z',
    updatedAt: '2026-06-09T02:30:00Z',
    timeline: [
      {
        status: 'Pending',
        note: 'Fire safety hazard found during routine inspection',
        timestamp: '2026-06-09T02:30:00Z',
        user: 'David Miller'
      }
    ],
    comments: []
  },
  {
    id: 'REQ-1095',
    title: 'Replacement of damaged common entry drywall',
    description: 'Scuff marks and deep hole in plasterboard near front elevator lobby.',
    propertyId: 'p-4',
    propertyName: 'Stonebridge Creative Lofts',
    unit: 'Elevator Lobby 1F',
    category: 'Structural',
    priority: 'Low',
    status: 'Completed',
    createdBy: 'Alondra Torres',
    createdById: 'u-unlisted-2',
    assignedTo: 'Carlos Santana',
    assignedToId: 'u-unlisted-staff-1',
    createdAt: '2026-06-01T10:00:00Z',
    updatedAt: '2026-06-05T15:30:00Z',
    timeline: [
      {
        status: 'Pending',
        note: 'Wall dent requested by tenant',
        timestamp: '2026-06-01T10:00:00Z',
        user: 'Alondra Torres'
      },
      {
        status: 'Assigned',
        note: 'Assigned to patch specialist Carlos',
        timestamp: '2026-06-02T09:00:00Z',
        user: 'Michael Chang'
      },
      {
        status: 'In Progress',
        note: 'Drywall compound applied and sanded',
        timestamp: '2026-06-04T11:00:00Z',
        user: 'Carlos Santana'
      },
      {
        status: 'Completed',
        note: 'Repainting finalized. Sand matches original cream texture.',
        timestamp: '2026-06-05T15:30:00Z',
        user: 'Carlos Santana'
      }
    ],
    comments: []
  }
];

// Predefined Amenities
export const sampleAmenities: Amenity[] = [
  {
    id: 'am-1',
    name: 'Skyline Pool',
    description: 'Rooftop infinity pool featuring expansive panoramic city views, modern heated loungers, and private changing cabanas.',
    capacity: 35,
    location: 'Summit Heights Residences, 18th Floor',
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=500&q=80',
    rules: [
      'Children must be supervised at all times.',
      'Max 2 external guests per unit allowed.',
      'No glassware or ceramics in or surrounding the wet area.'
    ],
    activeBookings: 8,
    operatingHours: '06:00 AM - 10:00 PM'
  },
  {
    id: 'am-2',
    name: 'Elite Gym & CrossFit Club',
    description: 'Olympic powerlifting racks, rowers, Pilates reformer benches, and heart rate monitoring cardio suites.',
    capacity: 20,
    location: 'Summit Heights Residences, Lower Level - B1',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=500&q=80',
    rules: [
      'Proper athletic closed-toe footwear required.',
      'Wipe down equipment after usage.',
      'Weights must not be slammed or thrown.'
    ],
    activeBookings: 14,
    operatingHours: '05:00 AM - Midnight'
  },
  {
    id: 'am-3',
    name: 'Executive Conference Forum',
    description: 'Sound-isolated meeting room equipped with 4K AirPlay presentation screen, fiber-optic audio bars, and ergonomic chairs.',
    capacity: 12,
    location: 'The Grid Tech Hub, Suite 300',
    image: 'https://images.unsplash.com/photo-1431540015161-0ae868a20404?auto=format&fit=crop&w=500&q=80',
    rules: [
      'Clean whiteboards prior to check-out.',
      'Ensure tech screen is powered off.',
      'Booking limits capped at 3 hours/day.'
    ],
    activeBookings: 2,
    operatingHours: '08:00 AM - 08:00 PM'
  },
  {
    id: 'am-4',
    name: 'The Glasshouse Club Room',
    description: 'Bespoke event lounge with integrated kitchen counter, state-of-the-art billiard tables, and high-fidelity sound speakers.',
    capacity: 50,
    location: 'Summit Heights Residences, Lobby Level',
    image: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=500&q=80',
    rules: [
      'A $150 refundable cleaning deposit is mandatory.',
      'Music and high decibels must stop after 10:00 PM.',
      'Pre-booking required minimum 48 hours early.'
    ],
    activeBookings: 5,
    operatingHours: '10:00 AM - 11:00 PM'
  },
  {
    id: 'am-5',
    name: 'Private Sports Arena',
    description: 'Dual-purpose indoor court configured for pro tennis, squash, and half-court basketball practice.',
    capacity: 10,
    location: 'Bella Vista Apartments, Leisure Park',
    image: 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&w=500&q=80',
    rules: [
      'Non-marking athletic shoes only.',
      'Rackets and ball supply can be claimed from front desk.',
      'Cancellations must be filed at least 4 hours ahead.'
    ],
    activeBookings: 1,
    operatingHours: '07:00 AM - 09:00 PM'
  }
];

// Predefined Bookings
export const sampleBookings: Booking[] = [
  {
    id: 'B-201',
    amenityId: 'am-1',
    amenityName: 'Skyline Pool',
    userName: 'Elena Rostova',
    userId: 'u-2',
    unit: 'Unit 4B',
    date: '2026-06-09',
    startTime: '10:00',
    endTime: '12:00',
    status: 'Confirmed',
    purpose: 'Morning family swimming practice',
    guestsCount: 2,
    createdAt: '2026-06-07T14:20:00Z'
  },
  {
    id: 'B-202',
    amenityId: 'am-3',
    amenityName: 'Executive Conference Forum',
    userName: 'Timothy Vance',
    userId: 'u-unlisted-3',
    unit: 'Suite 101',
    date: '2026-06-09',
    startTime: '13:00',
    endTime: '15:00',
    status: 'Confirmed',
    purpose: 'Product Pitch with Venture Group',
    guestsCount: 6,
    createdAt: '2026-06-08T09:12:00Z'
  },
  {
    id: 'B-203',
    amenityId: 'am-2',
    amenityName: 'Elite Gym & CrossFit Club',
    userName: 'Michael Chang',
    userId: 'u-1',
    unit: 'Staff Office',
    date: '2026-06-09',
    startTime: '08:00',
    endTime: '09:30',
    status: 'Confirmed',
    purpose: 'Morning Strength Program',
    guestsCount: 0,
    createdAt: '2026-06-08T18:00:00Z'
  },
  {
    id: 'B-204',
    amenityId: 'am-4',
    amenityName: 'The Glasshouse Club Room',
    userName: 'Clara Oswald',
    userId: 'u-unlisted-4',
    unit: 'Unit 12C',
    date: '2026-06-12',
    startTime: '18:00',
    endTime: '22:00',
    status: 'Pending',
    purpose: 'Birthday Gathering with Catering',
    guestsCount: 24,
    createdAt: '2026-06-08T14:00:00Z'
  }
];

// Predefined Real-time Activity Logs (Audits)
export const sampleActivityLogs: ActivityLog[] = [
  {
    id: 'l-1',
    type: 'maintenance',
    message: 'Elena Rostova submitted new plumbing distress request for Unit 4B',
    user: 'Elena Rostova',
    role: 'Tenant',
    time: '2 mins ago',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'l-2',
    type: 'booking',
    message: 'Executive Conference Forum booked successfully for board reviews',
    user: 'Timothy Vance',
    role: 'Tenant',
    time: '12 mins ago',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'l-3',
    type: 'system',
    message: 'System auto-confirmed 10:00 AM Pool scheduling window',
    user: 'PropertyFlow Bot',
    role: 'Admin',
    time: '1 hour ago',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'l-4',
    type: 'maintenance',
    message: 'David Miller updated valve repair request REQ-1092 status to "In Progress"',
    user: 'David Miller',
    role: 'Staff',
    time: '2 hours ago',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'l-5',
    type: 'user',
    message: 'New staff profile David Miller registered as Maintenance Technician',
    user: 'Michael Chang',
    role: 'Manager',
    time: '1 day ago',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
  }
];
