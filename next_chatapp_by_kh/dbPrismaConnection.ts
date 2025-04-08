import { PrismaClient } from "@prisma/client";

console.log("Inside dbPrismaConnection file");
const prismaClientSingleton = () => {
    console.log("Inside prismaClientSingleton fxn. Going to make new connection from new PrismaClient(), Fine?");
    return new PrismaClient();
}

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton();
// This syntax is using the Nullish Coalescing Operator (??) along with globalThis to manage a singleton instance of Prisma Client efficiently

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;