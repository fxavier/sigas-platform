/*
  Warnings:

  - Added the required column `updatedAt` to the `descricao_nao_conformidade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `relatorio_auditoria_interna` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "descricao_nao_conformidade" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "relatorio_auditoria_interna" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
