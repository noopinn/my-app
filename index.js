import http from "node:http";

// Render などの本番環境では PORT 環境変数が指定されるので、それを使う
const PORT = process.env.PORT || 8888;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  // 日本語が文字化けしないように設定する
  res.setHeader("Content-Type", "text/plain; charset=utf-8");

  if (url.pathname === "/") {
    console.log("GET / にアクセスがありました");
    res.writeHead(200);
    res.end("こんにちは！お主のサーバーが動いておるぞ。");
  } else if (url.pathname === "/ask") {
    const q = url.searchParams.get("q") ?? "質問なし";
    res.writeHead(200);
    res.end(`お主の質問は '${q}' ですな。`);
  } else {
    res.writeHead(404);
    res.end("ページが見つかりません。");
  }
});

server.listen(PORT, () => {
  console.log(`サーバーが http://localhost:${PORT} で起動しましたぞ。`);
});
