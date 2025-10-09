import prisma from "../prisma.js";

export class ProfesorModel {
  // Crear un profesor/destinatario
  static async create(data: any) {
    return prisma.profesor.create({ 
      data 
    });
  }

  // Actualizar un profesor
  static async update(id: number, data: any) {
    return prisma.profesor.update({
      where: { id },
      data
    });
  }

  // Eliminar un profesor
  static async delete(id: number) {
    return prisma.profesor.delete({
      where: { id }
    });
  }

  // Obtener todos los profesores
  static async findAll(filters: { activo?: boolean, area?: string } = {}) {
    const whereClause: any = {};
    
    if (filters.activo !== undefined) {
      whereClause.activo = filters.activo;
    }
    
    if (filters.area) {
      whereClause.area = {
        contains: filters.area,
        mode: 'insensitive'
      };
    }
    
    return prisma.profesor.findMany({
      where: whereClause,
      orderBy: {
        nombre_completo: 'asc'
      }
    });
  }

  // Obtener un profesor por ID
  static async findById(id: number) {
    return prisma.profesor.findUnique({
      where: { id }
    });
  }

  // Obtener profesores activos (para envío de correos)
  static async findActivos() {
    return prisma.profesor.findMany({
      where: { activo: true },
      orderBy: {
        nombre_completo: 'asc'
      }
    });
  }

  // Buscar profesores por nombre o correo
  static async search(termino: string) {
    return prisma.profesor.findMany({
      where: {
        OR: [
          {
            nombre_completo: {
              contains: termino,
              mode: 'insensitive'
            }
          },
          {
            correo: {
              contains: termino,
              mode: 'insensitive'
            }
          }
        ]
      },
      orderBy: {
        nombre_completo: 'asc'
      }
    });
  }

  // Cambiar estado activo/inactivo
  static async toggleActivo(id: number) {
    const profesor = await prisma.profesor.findUnique({
      where: { id }
    });
    
    if (!profesor) {
      throw new Error('Profesor no encontrado');
    }
    
    return prisma.profesor.update({
      where: { id },
      data: { activo: !profesor.activo }
    });
  }
}
