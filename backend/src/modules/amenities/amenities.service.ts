import { AmenitiesRepository } from './amenities.repository';
import { AppError } from '../../errors/AppError';
import { logAudit } from '../../utils/audit';
import { prisma } from '../../config/db';

export class AmenitiesService {
  private repo = new AmenitiesRepository();

  private mapAmenityToDTO(amenity: any) {
    let parsedRules: string[] = [];
    try {
      if (amenity.rules) {
        parsedRules = JSON.parse(amenity.rules);
      }
    } catch (err) {
      parsedRules = [];
    }

    return {
      id: amenity.id,
      propertyId: amenity.propertyId,
      propertyName: amenity.property?.name || undefined,
      name: amenity.name,
      description: amenity.description || null,
      capacity: amenity.capacity,
      location: amenity.location || null,
      imageUrl: amenity.imageUrl || null,
      rules: parsedRules,
      operatingHours: amenity.operatingHours || null,
      status: amenity.status,
      activeBookingsCount: amenity.bookings ? amenity.bookings.length : 0};
  }

  async createAmenity(
    data: {
      propertyId: string;
      name: string;
      description?: string | null;
      capacity: number;
      location?: string | null;
      imageUrl?: string | null;
      rules: string[];
      operatingHours?: string | null;
      status?: string;
    },
    userId?: string
  ) {
    // Verify property exists
    const property = await prisma.property.findFirst({
      where: { id: data.propertyId }});
    if (!property) {
      throw new AppError('The specified property ID does not exist.', 400);
    }

    const payload = {
      ...data,
      rules: JSON.stringify(data.rules || [])};

    const amenity = await this.repo.create(payload);
    await logAudit({
      userId,
      action: 'CREATE',
      entity: 'Amenity',
      entityId: amenity.id,
      details: JSON.stringify(data)});

    const created = await this.repo.findById(amenity.id);
    return this.mapAmenityToDTO(created);
  }

  async updateAmenity(
    id: string,
    data: Partial<{
      propertyId: string;
      name: string;
      description?: string | null;
      capacity: number;
      location?: string | null;
      imageUrl?: string | null;
      rules: string[];
      operatingHours?: string | null;
      status?: string;
    }>,
    userId?: string
  ) {
    const amenity = await this.repo.findById(id);
    if (!amenity) {
      throw new AppError('Amenity not found.', 404);
    }

    if (data.propertyId) {
      const property = await prisma.property.findFirst({
        where: { id: data.propertyId }});
      if (!property) {
        throw new AppError('The specified property ID does not exist.', 400);
      }
    }

    const payload: any = { ...data };
    if (data.rules !== undefined) {
      payload.rules = JSON.stringify(data.rules);
    }

    const updated = await this.repo.update(id, payload);
    await logAudit({
      userId,
      action: 'UPDATE',
      entity: 'Amenity',
      entityId: id,
      details: JSON.stringify(data)});

    const updatedAmenity = await this.repo.findById(updated.id);
    return this.mapAmenityToDTO(updatedAmenity);
  }

  async deleteAmenity(id: string, userId?: string) {
    const amenity = await this.repo.findById(id);
    if (!amenity) {
      throw new AppError('Amenity not found.', 404);
    }

    const deleted = await this.repo.delete(id);
    await logAudit({
      userId,
      action: 'DELETE',
      entity: 'Amenity',
      entityId: id,
      details: 'Soft deleted amenity'});

    return deleted;
  }

  async getAmenityById(id: string) {
    const amenity = await this.repo.findById(id);
    if (!amenity) {
      throw new AppError('Amenity not found.', 404);
    }
    return this.mapAmenityToDTO(amenity);
  }

  async listAmenities(filters: { page?: number; limit?: number; search?: string; propertyId?: string }) {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const items = await this.repo.findAll({
      skip,
      take: limit,
      search: filters.search,
      propertyId: filters.propertyId});

    const total = await this.repo.count({
      search: filters.search,
      propertyId: filters.propertyId});

    return {
      amenities: items.map((item) => this.mapAmenityToDTO(item)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)}};
  }
}

export default AmenitiesService;
