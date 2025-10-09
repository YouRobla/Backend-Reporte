import prisma from "../prisma.js";
export class ReporteModel {
    static async create(data) {
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
    static async update(id, data) {
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
    static async delete(id) {
        return prisma.reporte.delete({
            where: { id }
        });
    }
    static async findAll(page = 1, limit = 10, filters = {}) {
        const skip = (page - 1) * limit;
        // Construir filtros dinámicamente
        const whereClause = {};
        if (filters.nombre) {
            whereClause.nombre_completo = {
                contains: filters.nombre,
                mode: 'insensitive' // Búsqueda insensible a mayúsculas/minúsculas
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
                nombre: filters.nombre || null,
                estado: filters.estado || null
            }
        };
    }
    static async findById(id) {
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
    static async findByEstado(estado) {
        return prisma.reporte.findMany({
            where: { estado: estado },
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
    static async findByNumeroRegistro(numero_registro) {
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
