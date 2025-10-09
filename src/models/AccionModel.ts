import prisma from "../prisma.js";

export class AccionModel {
  static async create(data: any) {
    return prisma.accion.create({ 
      data,
      include: {
        evidencias: true,
        reporte: {
          include: {
            evidencias: true
          }
        }
      }
    });
  }

  static async update(id: number, data: any) {
    return prisma.accion.update({
      where: { id },
      data,
      include: {
        evidencias: true,
        reporte: {
          include: {
            evidencias: true
          }
        }
      }
    });
  }

  static async delete(id: number) {
    return prisma.accion.delete({
      where: { id }
    });
  }

  static async findAll() {
    return prisma.accion.findMany({
      include: {
        evidencias: true,
        reporte: {
          include: {
            evidencias: true
          }
        }
      },
      orderBy: {
        id: 'desc'
      }
    });
  }

  static async findById(id: number) {
    return prisma.accion.findUnique({
      where: { id },
      include: {
        evidencias: true,
        reporte: {
          include: {
            evidencias: true
          }
        }
      }
    });
  }

  static async findByReporteId(reporteId: number) {
    return prisma.accion.findMany({
      where: { reporteId },
      include: {
        evidencias: true,
        reporte: {
          include: {
            evidencias: true
          }
        }
      },
      orderBy: {
        id: 'desc'
      }
    });
  }

  // Actualizar estado del reporte basado en las acciones
  static async actualizarEstadoReporte(reporteId: number) {
    // Obtener todas las acciones del reporte
    const acciones = await prisma.accion.findMany({
      where: { reporteId }
    });

    let nuevoEstado = 'SinRevisar';

    if (acciones.length > 0) {
      // Si hay acciones, el reporte está en proceso
      nuevoEstado = 'EnProceso';
      
      // Verificar si todas las acciones están completadas
      // (esto dependería de agregar un campo 'completada' a las acciones)
      // Por ahora, solo cambiamos a EnProceso
    }

    // Actualizar el estado del reporte
    return prisma.reporte.update({
      where: { id: reporteId },
      data: { estado: nuevoEstado }
    });
  }
}
