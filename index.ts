import "dotenv/config";
import express from "express";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // これが遠距離通信の守り神じゃ
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter, log: ["query"] });

const app = express();
const PORT = process.env.PORT || 8888;

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.render("index", { users });
  } catch (error) {
    console.error("エラー:", error);
    res.status(500).send("DB読み込み失敗。Logsを確認しておくれ。");
  }
});

app.post("/users", async (req, res) => {
  const name = req.body.name;
  // 年齢を受け取って数値に変えるのじゃ
  const age = req.body.age ? Number(req.body.age) : null;
  if (name) {
    await prisma.user.create({ data: { name, age } });
  }
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`サーバー起動: http://localhost:${PORT}`);
});
