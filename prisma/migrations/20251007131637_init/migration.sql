-- CreateEnum
CREATE TYPE "EstadoReporte" AS ENUM ('SinRevisar', 'EnProceso', 'Revisado');

-- CreateTable
CREATE TABLE "Reporte" (
    "id" SERIAL NOT NULL,
    "numero_registro" TEXT NOT NULL,
    "tipo_documento" TEXT NOT NULL,
    "numero_documento" TEXT NOT NULL,
    "nombre_completo" TEXT NOT NULL,
    "correo_institucional" TEXT NOT NULL,
    "nombre_reportante" TEXT NOT NULL,
    "area_texto" TEXT NOT NULL,
    "tipo_reporte" TEXT NOT NULL,
    "relacionado_con" TEXT NOT NULL,
    "lugar_incidente" TEXT NOT NULL,
    "descripcion_observacion" TEXT NOT NULL,
    "estado" "EstadoReporte" NOT NULL DEFAULT 'SinRevisar',
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reporte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Accion" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "reporteId" INTEGER NOT NULL,

    CONSTRAINT "Accion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evidence" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "reporteId" INTEGER,
    "accionId" INTEGER,

    CONSTRAINT "Evidence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reporte_numero_registro_key" ON "Reporte"("numero_registro");

-- AddForeignKey
ALTER TABLE "Accion" ADD CONSTRAINT "Accion_reporteId_fkey" FOREIGN KEY ("reporteId") REFERENCES "Reporte"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_reporteId_fkey" FOREIGN KEY ("reporteId") REFERENCES "Reporte"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_accionId_fkey" FOREIGN KEY ("accionId") REFERENCES "Accion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
