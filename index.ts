import "dotenv/config";
import express from "express";
import { Pool } from "pg"; // pg から Pool を読み込むぞ
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

// データベースの住所を使って「コネクションプール」を作るのじゃ
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
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
    console.error("エラーが発生したぞ:", error);
    res
      .status(500)
      .send("データベースの読み込みに失敗しましたぞ。ログを確認しておくれ。");
  }
});

app.post("/users", async (req, res) => {
  const name = req.body.name;
  const age = req.body.age ? Number(req.body.age) : null;
  if (name) {
    await prisma.user.create({ data: { name, age } });
  }
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`サーバーが http://localhost:${PORT} で起動しましたぞ。`);
});
