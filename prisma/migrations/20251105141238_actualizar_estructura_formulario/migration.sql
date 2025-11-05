/*
  Warnings:

  - You are about to drop the column `area_texto` on the `Reporte` table. All the data in the column will be lost.
  - You are about to drop the column `correo_institucional` on the `Reporte` table. All the data in the column will be lost.
  - You are about to drop the column `nombre_completo` on the `Reporte` table. All the data in the column will be lost.
  - You are about to drop the column `nombre_reportante` on the `Reporte` table. All the data in the column will be lost.
  - You are about to drop the column `relacionado_con` on the `Reporte` table. All the data in the column will be lost.
  - Added the required column `sede` to the `Reporte` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Accion" DROP CONSTRAINT "Accion_reporteId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Evidence" DROP CONSTRAINT "Evidence_accionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Evidence" DROP CONSTRAINT "Evidence_reporteId_fkey";

-- AlterTable
ALTER TABLE "Reporte" DROP COLUMN "area_texto",
DROP COLUMN "correo_institucional",
DROP COLUMN "nombre_completo",
DROP COLUMN "nombre_reportante",
DROP COLUMN "relacionado_con",
ADD COLUMN     "acciones_tomadas" TEXT,
ADD COLUMN     "sede" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Accion" ADD CONSTRAINT "Accion_reporteId_fkey" FOREIGN KEY ("reporteId") REFERENCES "Reporte"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_reporteId_fkey" FOREIGN KEY ("reporteId") REFERENCES "Reporte"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_accionId_fkey" FOREIGN KEY ("accionId") REFERENCES "Accion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
