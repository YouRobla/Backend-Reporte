import prisma from "../prisma.js";

export class EvidenceModel {
  static async create(data: any) {
    return prisma.evidencia.create({ 
      data,
      include: {
        reporte: {
          include: {
            evidencias: true,
            acciones: {
              include: {
                evidencias: true
              }
            }
          }
        },
        accion: {
          include: {
            evidencias: true,
            reporte: {
              include: {
                evidencias: true
              }
            }
          }
        }
      }
    });
  }

  static async update(id: number, data: any) {
    return prisma.evidencia.update({
      where: { id },
      data,
      include: {
        reporte: {
          include: {
            evidencias: true,
            acciones: {
              include: {
                evidencias: true
              }
            }
          }
        },
        accion: {
          include: {
            evidencias: true,
            reporte: {
              include: {
                evidencias: true
              }
            }
          }
        }
      }
    });
  }

  static async delete(id: number) {
    return prisma.evidencia.delete({
      where: { id }
    });
  }

  static async findAll() {
    return prisma.evidencia.findMany({
      include: {
        reporte: {
          include: {
            evidencias: true,
            acciones: {
              include: {
                evidencias: true
              }
            }
          }
        },
        accion: {
          include: {
            evidencias: true,
            reporte: {
              include: {
                evidencias: true
              }
            }
          }
        }
      },
      orderBy: {
        id: 'desc'
      }
    });
  }

  static async findById(id: number) {
    return prisma.evidencia.findUnique({
      where: { id },
      include: {
        reporte: {
          include: {
            evidencias: true,
            acciones: {
              include: {
                evidencias: true
              }
            }
          }
        },
        accion: {
          include: {
            evidencias: true,
            reporte: {
              include: {
                evidencias: true
              }
            }
          }
        }
      }
    });
  }

  static async findByReporteId(reporteId: number) {
    return prisma.evidencia.findMany({
      where: { reporteId },
      include: {
        reporte: {
          include: {
            evidencias: true,
            acciones: {
              include: {
                evidencias: true
              }
            }
          }
        },
        accion: {
          include: {
            evidencias: true,
            reporte: {
              include: {
                evidencias: true
              }
            }
          }
        }
      },
      orderBy: {
        id: 'desc'
      }
    });
  }

  static async findByAccionId(accionId: number) {
    return prisma.evidencia.findMany({
      where: { accionId },
      include: {
        reporte: {
          include: {
            evidencias: true,
            acciones: {
              include: {
                evidencias: true
              }
            }
          }
        },
        accion: {
          include: {
            evidencias: true,
            reporte: {
              include: {
                evidencias: true
              }
            }
          }
        }
      },
      orderBy: {
        id: 'desc'
      }
    });
  }
}
