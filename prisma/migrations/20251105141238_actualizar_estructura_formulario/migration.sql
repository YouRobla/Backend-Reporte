/*
  Warnings:

  - You are about to drop the column `area_texto` on the `Reporte` table. All the data in the column will be lost.
  - You are about to drop the column `correo_institucional` on the `Reporte` table. All the data in the column will be lost.
  - You are about to drop the column `nombre_completo` on the `Reporte` table. All the data in the column will be lost.
  - You are about to drop the column `nombre_reportante` on the `Reporte` table. All the data in the column will be lost.
  - You are about to drop the column `relacionado_con` on the `Reporte` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Accion" DROP CONSTRAINT "Accion_reporteId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Evidence" DROP CONSTRAINT "Evidence_accionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Evidence" DROP CONSTRAINT "Evidence_reporteId_fkey";

-- Paso 1: Agregar nuevas columnas como opcionales (NULL permitido)
ALTER TABLE "Reporte" 
  ADD COLUMN "acciones_tomadas" TEXT,
  ADD COLUMN "sede" TEXT;

-- Paso 2: Rellenar valores existentes con un valor por defecto
UPDATE "Reporte" 
SET "sede" = 'SIN_SEDE' 
WHERE "sede" IS NULL;

-- Paso 3: Eliminar columnas antiguas que ya no se usan
ALTER TABLE "Reporte" 
  DROP COLUMN "area_texto",
  DROP COLUMN "correo_institucional",
  DROP COLUMN "nombre_completo",
  DROP COLUMN "nombre_reportante",
  DROP COLUMN "relacionado_con";

-- Paso 4: Hacer la columna `sede` requerida (NOT NULL)
ALTER TABLE "Reporte" 
  ALTER COLUMN "sede" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Accion" ADD CONSTRAINT "Accion_reporteId_fkey" FOREIGN KEY ("reporteId") REFERENCES "Reporte"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_reporteId_fkey" FOREIGN KEY ("reporteId") REFERENCES "Reporte"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_accionId_fkey" FOREIGN KEY ("accionId") REFERENCES "Accion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
