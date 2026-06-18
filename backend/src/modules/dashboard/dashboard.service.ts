import { prisma } from '../../config/db';
import { BookingStatus, MaintenanceStatus } from '@prisma/client';
import { BookingsService } from '../bookings/bookings.service';

const bookingsService = new BookingsService();

export class DashboardService {
  async getKPIs() {
    // Automatically transition unattended APPROVED bookings to NO_SHOW after 30-minute grace period
    try {
      await bookingsService.checkNoShowBookings();
    } catch (err) {
      console.error('Error auto-transitioning no-show bookings in getKPIs:', err);
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    // ==========================================
    // 1. PROPERTY KPIs
    // ==========================================
    const totalProperties = await prisma.property.count({ where: { deletedAt: null } });
    
    // Occupancy Rate: Average occupancy rate across all active properties
    const propertiesData = await prisma.property.findMany({
      where: { deletedAt: null },
      select: { occupancyRate: true },
    });
    const avgOccupancyRate = propertiesData.length > 0 
      ? Number((propertiesData.reduce((acc, p) => acc + p.occupancyRate, 0) / propertiesData.length).toFixed(1))
      : 0;

    // Active Tenants: users linked to the Tenant role
    const activeTenants = await prisma.user.count({
      where: {
        deletedAt: null,
        roles: {
          some: {
            role: {
              name: 'Tenant',
            },
          },
        },
      },
    });

    // ==========================================
    // 2. MAINTENANCE KPIs
    // ==========================================
    const maintenanceRequests = await prisma.maintenanceRequest.findMany({
      where: { deletedAt: null },
    });

    const totalRequests = maintenanceRequests.length;
    const completedRequests = maintenanceRequests.filter(r => r.status === MaintenanceStatus.COMPLETED);
    const openRequests = maintenanceRequests.filter(r => 
      r.status === MaintenanceStatus.PENDING || 
      r.status === MaintenanceStatus.ASSIGNED || 
      r.status === MaintenanceStatus.IN_PROGRESS
    );

    const completionRate = totalRequests > 0 
      ? Number(((completedRequests.length / totalRequests) * 100).toFixed(1))
      : 0;

    // SLA thresholds: 48 hours
    const SLA_LIMIT_MS = 48 * 60 * 60 * 1000;
    const SLA_NEAR_MS = 36 * 60 * 60 * 1000;

    let totalResolutionTimeMs = 0;
    let completedWithinSla = 0;
    let withinSlaCount = 0;
    let nearSlaBreachCount = 0;
    let slaBreachedCount = 0;

    for (const req of maintenanceRequests) {
      if (req.status === MaintenanceStatus.COMPLETED && req.resolvedAt) {
        const resolutionTime = req.resolvedAt.getTime() - req.createdAt.getTime();
        totalResolutionTimeMs += resolutionTime;

        if (resolutionTime <= SLA_LIMIT_MS) {
          completedWithinSla++;
          withinSlaCount++;
        } else {
          slaBreachedCount++;
        }
      } else {
        // Open requests
        const age = now.getTime() - req.createdAt.getTime();
        if (age > SLA_LIMIT_MS) {
          slaBreachedCount++;
        } else if (age > SLA_NEAR_MS) {
          nearSlaBreachCount++;
        } else {
          withinSlaCount++;
        }
      }
    }

    const avgResolutionTime = completedRequests.length > 0
      ? Number((totalResolutionTimeMs / completedRequests.length / (1000 * 60 * 60)).toFixed(1)) // in hours
      : 0;

    const slaCompliance = completedRequests.length > 0
      ? Number(((completedWithinSla / completedRequests.length) * 100).toFixed(1))
      : 100;

    // ==========================================
    // 3. AMENITY KPIs
    // ==========================================
    const bookings = await prisma.amenityBooking.findMany({
      where: { deletedAt: null },
      include: { amenity: true },
    });

    const totalBookings = bookings.length;
    const activeBookings = bookings.filter(b => b.status === BookingStatus.IN_USE).length;
    const completedBookings = bookings.filter(b => b.status === BookingStatus.COMPLETED).length;
    const noShowBookings = bookings.filter(b => b.status === BookingStatus.NO_SHOW).length;

    const bookingUtilization = totalBookings > 0
      ? Number((((activeBookings + completedBookings) / totalBookings) * 100).toFixed(1))
      : 0;

    const noShowRate = totalBookings > 0
      ? Number(((noShowBookings / totalBookings) * 100).toFixed(1))
      : 0;

    // Average Booking Duration (in hours)
    let totalBookingDurationMs = 0;
    let completedBookingsWithDuration = 0;

    for (const b of bookings) {
      if (b.status === BookingStatus.COMPLETED && b.actualCheckInAt && b.actualCheckOutAt) {
        totalBookingDurationMs += b.actualCheckOutAt.getTime() - b.actualCheckInAt.getTime();
        completedBookingsWithDuration++;
      }
    }

    const avgBookingDuration = completedBookingsWithDuration > 0
      ? Number((totalBookingDurationMs / completedBookingsWithDuration / (1000 * 60 * 60)).toFixed(1))
      : 0;

    // Most Popular Amenity
    const amenityCounts: Record<string, { name: string; count: number }> = {};
    for (const b of bookings) {
      if (b.amenity) {
        if (!amenityCounts[b.amenityId]) {
          amenityCounts[b.amenityId] = { name: b.amenity.name, count: 0 };
        }
        amenityCounts[b.amenityId].count++;
      }
    }

    let mostPopularAmenity = 'N/A';
    let maxAmenityCount = 0;
    for (const id in amenityCounts) {
      if (amenityCounts[id].count > maxAmenityCount) {
        maxAmenityCount = amenityCounts[id].count;
        mostPopularAmenity = amenityCounts[id].name;
      }
    }

    // Peak Amenity Usage Hours
    const hourCounts: Record<number, number> = {};
    for (const b of bookings) {
      const hour = b.startTime.getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    }

    let peakHour = -1;
    let maxHourCount = 0;
    for (let h = 0; h < 24; h++) {
      if ((hourCounts[h] || 0) > maxHourCount) {
        maxHourCount = hourCounts[h] || 0;
        peakHour = h;
      }
    }

    const peakAmenityUsageHours = peakHour !== -1
      ? `${peakHour % 12 || 12}:00 ${peakHour >= 12 ? 'PM' : 'AM'} - ${(peakHour + 1) % 12 || 12}:00 ${(peakHour + 1) >= 12 ? 'PM' : 'AM'}`
      : 'N/A';

    // ==========================================
    // 4. MONTH-OVER-MONTH TRENDS
    // ==========================================
    // Bookings trend
    const currentMonthBookings = await prisma.amenityBooking.count({
      where: { deletedAt: null, createdAt: { gte: thirtyDaysAgo } },
    });
    const prevMonthBookings = await prisma.amenityBooking.count({
      where: { deletedAt: null, createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } },
    });
    const bookingsTrend = prevMonthBookings > 0
      ? Number((((currentMonthBookings - prevMonthBookings) / prevMonthBookings) * 100).toFixed(1))
      : currentMonthBookings > 0 ? 100 : 0;

    // Maintenance completions trend
    const currentMonthCompletions = await prisma.maintenanceRequest.count({
      where: { deletedAt: null, status: MaintenanceStatus.COMPLETED, resolvedAt: { gte: thirtyDaysAgo } },
    });
    const prevMonthCompletions = await prisma.maintenanceRequest.count({
      where: { deletedAt: null, status: MaintenanceStatus.COMPLETED, resolvedAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } },
    });
    const maintenanceTrend = prevMonthCompletions > 0
      ? Number((((currentMonthCompletions - prevMonthCompletions) / prevMonthCompletions) * 100).toFixed(1))
      : currentMonthCompletions > 0 ? 100 : 0;

    // Occupancy trend (mocked trend based on properties addition or average rate trend)
    const currentProperties = await prisma.property.findMany({
      where: { deletedAt: null, createdAt: { gte: thirtyDaysAgo } },
      select: { occupancyRate: true },
    });
    const prevProperties = await prisma.property.findMany({
      where: { deletedAt: null, createdAt: { lt: thirtyDaysAgo } },
      select: { occupancyRate: true },
    });

    const currentAvgOcc = currentProperties.length > 0
      ? currentProperties.reduce((acc, p) => acc + p.occupancyRate, 0) / currentProperties.length
      : 90; // Fallback / baseline
    const prevAvgOcc = prevProperties.length > 0
      ? prevProperties.reduce((acc, p) => acc + p.occupancyRate, 0) / prevProperties.length
      : 88; // Fallback / baseline
    
    const occupancyTrend = Number((currentAvgOcc - prevAvgOcc).toFixed(1));

    return {
      properties: {
        totalProperties,
        occupancyRate: avgOccupancyRate,
        activeTenants,
        trends: {
          occupancyRate: occupancyTrend,
        },
      },
      maintenance: {
        averageResolutionTime: avgResolutionTime,
        openRequests: openRequests.length,
        completedRequests: completedRequests.length,
        completionRate,
        slaCompliance,
        slaBreakdown: {
          withinSla: withinSlaCount,
          nearSlaBreach: nearSlaBreachCount,
          slaBreached: slaBreachedCount,
        },
        trends: {
          completions: maintenanceTrend,
        },
      },
      amenity: {
        totalBookings,
        activeBookings,
        completedBookings,
        bookingUtilization,
        noShowRate,
        averageBookingDuration: avgBookingDuration,
        mostPopularAmenity,
        peakAmenityUsageHours,
        trends: {
          bookings: bookingsTrend,
        },
      },
    };
  }
}

export default DashboardService;
