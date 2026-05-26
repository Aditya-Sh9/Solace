"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const globalForPrisma = globalThis;
function makePrisma() {
    const adapter = new adapter_pg_1.PrismaPg({ connectionString: process.env.DATABASE_URL });
    return new client_1.PrismaClient({ adapter });
}
exports.prisma = globalForPrisma.prisma ?? makePrisma();
if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = exports.prisma;
