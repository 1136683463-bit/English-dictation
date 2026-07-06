# 实现说明

更新时间：2026-06-17

## 当前状态

首版功能闭环已经实现为 React/Vite 应用，并预置 Tauri 2 工程目录。

已完成：

- 今日学习台
- 单词本 CRUD
- 句子本 CRUD
- 文本导入、拆句、候选词提取
- 间隔复习队列
- 单词拼写/句子回译/轻听写入口
- 文本 diff 批改
- 错误记录与复习计划更新
- 学习统计
- JSON、Anki CSV、Markdown 导出
- Web Speech API 发音/轻听写播放
- AI service 空接口预留

## 数据存储说明

计划目标是 Tauri + SQLite。本机当前缺少 Rust/Cargo，无法完成 Tauri 桌面构建和 SQLite 插件运行验证，因此当前可运行版本先使用 `localStorage` 做本地持久化。

服务层已经集中在 `src/services/`，后续切换 SQLite 时主要替换 `storage.ts` 和服务内部的数据读写实现，页面组件不需要大改。

后续 SQLite 迁移步骤：

1. 安装 Rust/Cargo。
2. 运行 `npm run tauri dev` 验证 Tauri shell。
3. 用 `@tauri-apps/plugin-sql` 创建 `sqlite:vocab.db`。
4. 添加 migrations，创建计划中的表。
5. 将 `loadData/saveData` 替换为 SQLite 查询与事务写入。
6. 保留 JSON 导出作为备份能力。

## 验证结果

已通过：

- `npm install`
- `npm run build`
- `npm run dev -- --host 127.0.0.1`
- 浏览器打开 `http://127.0.0.1:1420/`
- 新增单词 `approach`
- 进入复习页看到到期卡片
- 提交一次复习反馈
- 进入统计页看到复习统计

未完成：

- Tauri 桌面运行验证，原因：当前环境没有 `rustc` 和 `cargo`。
- SQLite 插件运行验证，原因同上。

