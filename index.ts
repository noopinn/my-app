import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

// データベースに接続するためのコネクションプールとアダプターを用意する
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter, log: ["query"] });

async function main() {
  console.log("データベースにユーザーを 1 件追加するぞ...");

  // ユーザーを 1 件追加して、一覧を取得する
  await prisma.user.create({
    data: { name: `新しいユーザー ${new Date().toISOString()}` },
  });

  const users = await prisma.user.findMany();
  console.log("現在のユーザー一覧:", users);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  // 接続をきれいに閉じるための処理じゃ
  .finally(() => Promise.all([prisma.$disconnect(), pool.end()]));
