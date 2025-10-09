import prisma from "../prisma.js";
export class EvidenceModel {
    static async create(data) {
        return prisma.evidence.create({
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
    static async update(id, data) {
        return prisma.evidence.update({
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
    static async delete(id) {
        return prisma.evidence.delete({
            where: { id }
        });
    }
    static async findAll() {
        return prisma.evidence.findMany({
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
    static async findById(id) {
        return prisma.evidence.findUnique({
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
    static async findByReporteId(reporteId) {
        return prisma.evidence.findMany({
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
    static async findByAccionId(accionId) {
        return prisma.evidence.findMany({
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
