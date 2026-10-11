# 从 s-forge 迁出

2026-10-11（Asia/Shanghai），来源提交 b206db2193345a02b278bf29274a963d91b46568。

- `packages/vectordb` 的 Go 引擎迁入仓库根模块，模块名为 `github.com/leolee9086/vectordb`。
- `packages/vectordb-node/sidecar` 的命令和测试迁入 `cmd/vectordb-sidecar`，并入同一个 Go 模块，不保留本地 replace。
- TypeScript 客户端、协议和测试位于 `node`，npm 名称保留 `@leolee9086/vectordb`。
- 嵌入服务实验与探针位于 `tools/embedding`，不随 npm 包分发。
- 保留原版权头和 AGPL-3.0-or-later 许可，磁盘格式与协议 v1 保持兼容。
- s-forge 自身的 kernel/vectordb 是独立集成实现，此次不迁移或替换。

迁移验证使用 Go、Node 行为测试和独立安装，不做文件逐字节或哈希对比。历史基准保留在文档中，不作为新仓本次测试结果。
