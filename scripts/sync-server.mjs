#!/usr/bin/env node
/**
 * 听写工坊 - 个人数据同步服务
 *
 * 一个零依赖的 Node 脚本，为应用提供"换浏览器/换设备数据不丢"的云同步端点。
 * 数据以 JSON 文件形式保存在服务器本地，只有你（持有令牌）能读写。
 *
 * 部署（在你的服务器上，例如运行 locahost8080.xyz 的那台机器）：
 *
 *   1. 把本文件上传到服务器任意目录
 *   2. 设置访问令牌并启动（令牌要和应用设置里填的一致）：
 *        TOKEN=你的口令 PORT=8787 node sync-server.mjs
 *   3. 建议用 pm2 / systemd 常驻，并用 nginx 反代到 https 域名下
 *      （例如 https://locahost8080.xyz/sync -> 127.0.0.1:8787/sync）
 *   4. 应用"设置 -> 云同步"里填服务地址（如 https://locahost8080.xyz）
 *      和同一个令牌，启用后换浏览器会自动恢复数据
 *
 * 接口：
 *   GET  /sync   读取云端快照，没有数据时返回 404
 *   POST /sync   保存 { payload: <AppData> }，返回 { savedAt }
 *
 * 鉴权：设置了 TOKEN 时，请求需带 Authorization: Bearer <TOKEN>。
 * CORS：默认允许所有来源（数据安全靠令牌，不靠同源策略）。
 */

import { createServer } from "node:http";
import { promises as fs } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PORT = Number(process.env.PORT || 8787);
const TOKEN = process.env.TOKEN || "";
const DATA_FILE = process.env.DATA_FILE || join(dirname(fileURLToPath(import.meta.url)), "sync-data.json");
const MAX_BODY_BYTES = 32 * 1024 * 1024;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
  "Access-Control-Max-Age": "86400"
};

const sendJson = (res, status, body) => {
  const text = JSON.stringify(body);
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", ...corsHeaders });
  res.end(text);
};

const readBody = (req) => new Promise((resolve, reject) => {
  const chunks = [];
  let size = 0;
  req.on("data", (chunk) => {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      reject(new Error("payload too large"));
      req.destroy();
      return;
    }
    chunks.push(chunk);
  });
  req.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  req.on("error", reject);
});

const isAuthorized = (req) => {
  if (!TOKEN) return true;
  const header = req.headers.authorization || "";
  return header === `Bearer ${TOKEN}`;
};

const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  if (url.pathname !== "/sync") {
    sendJson(res, 404, { error: { message: "not found" } });
    return;
  }
  if (req.method === "OPTIONS") {
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }
  if (!isAuthorized(req)) {
    sendJson(res, 401, { error: { message: "令牌不正确。请检查应用设置与服务器 TOKEN 是否一致。" } });
    return;
  }

  try {
    if (req.method === "GET") {
      try {
        const raw = await fs.readFile(DATA_FILE, "utf-8");
        const snapshot = JSON.parse(raw);
        sendJson(res, 200, snapshot);
      } catch (error) {
        if (error.code === "ENOENT") sendJson(res, 404, { error: { message: "云端还没有数据。" } });
        else throw error;
      }
      return;
    }

    if (req.method === "POST") {
      const body = await readBody(req);
      let parsed;
      try {
        parsed = JSON.parse(body);
      } catch {
        sendJson(res, 400, { error: { message: "请求体不是合法 JSON。" } });
        return;
      }
      if (!parsed || typeof parsed !== "object" || !("payload" in parsed)) {
        sendJson(res, 400, { error: { message: "请求体缺少 payload 字段。" } });
        return;
      }
      const savedAt = new Date().toISOString();
      await fs.writeFile(DATA_FILE, JSON.stringify({ savedAt, payload: parsed.payload }), "utf-8");
      sendJson(res, 200, { savedAt });
      return;
    }

    sendJson(res, 405, { error: { message: "method not allowed" } });
  } catch (error) {
    sendJson(res, 500, { error: { message: error instanceof Error ? error.message : "internal error" } });
  }
});

server.listen(PORT, () => {
  console.log(`[sync-server] listening on http://0.0.0.0:${PORT} (data file: ${DATA_FILE}${TOKEN ? ", token: enabled" : ", token: DISABLED - set TOKEN to protect your data"})`);
});
