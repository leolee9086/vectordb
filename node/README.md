# @leolee9086/vectordb

TypeScript / Node.js 向量数据库客户端，通过包内预编译 Go 侧车提供 DiskVamana、HNSW 和多字段 Dataset。无需 node-gyp、Go 或相邻源码。

```sh
pnpm add @leolee9086/vectordb
```

```ts
import { openVectorDB } from '@leolee9086/vectordb';

const db = await openVectorDB({ path: './vectors' });
try {
  const collection = await db.createCollection('notes', {
    engine: 'hnsw', dimension: 3, distanceMetric: 'cosine',
  });
  await collection.write([{ id: 'first', vector: [1, 0, 0], meta: { text: 'hello' } }]);
  console.log(await collection.search([1, 0, 0], { topK: 5 }));
} finally {
  await db.close();
}
```

发布包内含 Windows x64、Linux x64/arm64、macOS x64/arm64 侧车，按平台自动选择。可通过 `binary` 参数或 `VECTORDB_SIDECAR` 指定自建侧车。数据库目录由侧车持有独占锁，调用 `close` 释放资源。

DiskVamana 创建集合需要初始点集；cosine 存储归一化后的向量。写入、删除、检查点及关闭重开保留元数据和提交语义。完整 API 类型见随包声明，源码、引擎说明和协议历史见 https://github.com/leolee9086/vectordb 。

开发：在独立仓库 node 目录运行 `pnpm install`、`pnpm build`、`pnpm test`。`pnpm build:release` 生成全部发布目标；`pnpm pack` 自动执行发布构建。包内安装无需执行构建脚本。

AGPL-3.0-or-later。
