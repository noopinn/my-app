import "dotenv/config";
import express from "express";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

// データベース接続の準備（Part 4 と同じじゃ）
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter, log: ["query"] });

const app = express();
const PORT = process.env.PORT || 8888;

// EJS という仕組みを使って画面を作る設定じゃ
app.set("view engine", "ejs");
app.set("views", "./views");
// フォームから送られてきたデータを受け取れるようにする設定じゃ
app.use(express.urlencoded({ extended: true }));

// ブラウザで 「/」 にアクセスした時の処理
app.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  // views/index.ejs を使って画面を表示するぞ
  res.render("index", { users });
});

// ユーザーを追加するボタンが押された時の処理
app.post("/users", async (req, res) => {
  const name = req.body.name;
  if (name) {
    const newUser = await prisma.user.create({ data: { name } });
    console.log("データベースに追加したぞ:", newUser);
  }
  // 追加が終わったら一覧画面に戻るのじゃ
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`サーバーが http://localhost:${PORT} で起動しましたぞ。`);
});
