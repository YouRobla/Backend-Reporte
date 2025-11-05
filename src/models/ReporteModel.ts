import prisma from "../prisma.js";

export class ReporteModel {
  static async create(data: any) {
    // Generar numero_registro automáticamente
    const totalReportes = await prisma.reporte.count();
    const numeroRegistro = String(totalReportes + 1).padStart(8, '0');
    
    return prisma.reporte.create({ 
      data: {
        ...data,
        numero_registro: numeroRegistro
        // fecha_inicio se establecerá DESPUÉS cuando se suban las evidencias
      },
      include: {
        evidencias: true,
        acciones: {
          include: {
            evidencias: true
          }
        }
      }
    });
  }

  static async update(id: number, data: any) {
    return prisma.reporte.update({
      where: { id },
      data,
      include: {
        evidencias: true,
        acciones: {
          include: {
            evidencias: true
          }
        }
      }
    });
  }

  static async delete(id: number) {
    return prisma.reporte.delete({
      where: { id }
    });
  }

  static async findAll(page: number = 1, limit: number = 10, filters: { sede?: string, estado?: string, tipo_reporte?: string } = {}) {
    const skip = (page - 1) * limit;
    
    // Construir filtros dinámicamente
    const whereClause: any = {};
    
    if (filters.sede) {
      whereClause.sede = {
        contains: filters.sede,
        mode: 'insensitive' // Búsqueda insensible a mayúsculas/minúsculas
      };
    }
    
    if (filters.tipo_reporte) {
      whereClause.tipo_reporte = {
        contains: filters.tipo_reporte,
        mode: 'insensitive'
      };
    }
    
    if (filters.estado) {
      whereClause.estado = filters.estado;
    }
    
    const [reportes, total] = await Promise.all([
      prisma.reporte.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          evidencias: true,
          acciones: {
            include: {
              evidencias: true
            }
          }
        },
        orderBy: {
          fecha_registro: 'desc'
        }
      }),
      prisma.reporte.count({
        where: whereClause
      })
    ]);

    return {
      reportes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      },
      filters: {
        sede: filters.sede || null,
        tipo_reporte: filters.tipo_reporte || null,
        estado: filters.estado || null
      }
    };
  }

  static async findById(id: number) {
    return prisma.reporte.findUnique({
      where: { id },
      include: {
        evidencias: true,
        acciones: {
          include: {
            evidencias: true
          }
        }
      }
    });
  }

  static async findByEstado(estado: string) {
    return prisma.reporte.findMany({
      where: { estado: estado as any },
      include: {
        evidencias: true,
        acciones: {
          include: {
            evidencias: true
          }
        }
      },
      orderBy: {
        fecha_registro: 'desc'
      }
    });
  }

  static async findByNumeroRegistro(numero_registro: string) {
    return prisma.reporte.findUnique({
      where: { numero_registro },
      include: {
        evidencias: true,
        acciones: {
          include: {
            evidencias: true
          }
        }
      }
    });
  }
}
