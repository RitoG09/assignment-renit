// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient({
//   log: ["error", "query"],
//   errorFormat: "pretty",
// });
// export default prisma;
// .\src\generated\prisma
import { PrismaClient } from "../../src/generated/prisma/index.js";
const prisma = new PrismaClient({
    log: ["error", "query"],
    errorFormat: "pretty",
});
export default prisma;
