# vectordb

独立的 Go 向量数据库与 TypeScript / Node.js 客户端，支持 DiskVamana 和内存 HNSW、Dataset、多字段向量索引、WAL、检查点和关闭重开恢复。基础库不依赖 s-forge、DSH 或嵌入模型服务。

## 包结构

- 根 Go 模块：`github.com/leolee9086/vectordb`，数据库、集合与 Dataset API。
- `bbq`、`hnsw`、`storage`、`vamana`：量化、索引和磁盘实现。
- `cmd/vectordb-sidecar`：stdio 协议 v1 命令，与引擎在同一 Go 模块中。
- `node`：npm 包 `@leolee9086/vectordb`，严格 TypeScript 客户端、协议、测试和发布脚本。
- `tools/embedding`：可选嵌入模型探针，不属于安装包。
- `docs`：引擎契约、迁移来源及历史实验记录。

Go 消费者通过版本化 Go module 使用；Node 消费者通过 npm 版本使用，不需要相邻源码、Go 工具链或本地路径替换。

## 构建与测试

根目录运行 `go test ./... -short -count=1 -timeout 180s`。进入 node 后运行 `pnpm install`、`pnpm build`、`pnpm test`。Go 工具链版本由 go.mod 声明；开发脚本需要 Node >=22.19。

`pnpm build:release` 构建 Windows x64、Linux x64/arm64、macOS x64/arm64 侧车，`pnpm pack` 自动执行该构建。npm 只分发运行代码、类型声明、对应 TypeScript 源码、预编译侧车、说明与许可。安装时没有构建或下载脚本。

交叉编译不代表目标平台已实际运行；CI 在 Windows、Linux 与 macOS 主机运行 Go 和 Node 行为测试。

若工作区构建产物被运行环境赋予低完整度，可用 `pnpm build:sidecar --out-dir <工作区外的构建目录>` 生成测试产物，并设置 `VECTORDB_SIDECAR` 指向其中的本机二进制，再运行测试。不修改工作区的安全标签或 ACL。

`node --test test/installed.test.ts` 验证公开包入口的 Dataset 持久化。该测试也可复制到干净目录，安装 tarball 后直接运行，以检查包内侧车自动选择。

## 可选基准数据

普通测试不需要 SIFT。规模测试显式设置 `VECTORDB_SCALE_TEST=1`，数据通过 `VECTORDB_SIFT_DIR` 指定，也可以放到本仓 `test_data/sift`。大型数据、模型和原工作区产物不随源码迁移。

## 兼容性与来源

Node API、stdio v1 协议和磁盘格式在本次迁出中保持兼容。迁移自 s-forge 两个基础包，来源见 [迁移记录](docs/migration.md)。[引擎说明](docs/engine.md)和[历史客户端实验](docs/legacy-node.md)保留原有设计与实验结果，历史指标不代表本次验收。

AGPL-3.0-or-later，原版权头随源码保留。
