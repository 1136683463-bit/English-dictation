#!/usr/bin/env bash
# 本批全部核查命令（只读）
cd /Users/liujun/Documents/英语听写
echo "### 环境"
node --version
./node_modules/.bin/vite-node --version
echo
echo "### 核查脚本清单"
for f in deliverables/product-strategy/working/told-audit-2026-09-23/s*.ts; do
  echo "--- $f"
done
