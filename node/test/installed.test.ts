import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { openVectorDB } from "@leolee9086/vectordb";

// 只走包公开入口；同一测试可复制到干净安装目录，验证包内侧车与持久化。
test("安装包：多字段 Dataset 写入、融合检索、删除及关闭重开", async () => {
  const directory = await mkdtemp(join(tmpdir(), "vectordb-installed-"));
  let db: Awaited<ReturnType<typeof openVectorDB>> | undefined;
  try {
    db = await openVectorDB({ path: directory });
    let dataset = await db.createDataset("memory", {
      embeddings: { text: { dimension: 2, distanceMetric: "cosine" }, image: { dimension: 3, distanceMetric: "cosine" } },
      indexes: { text: { embedding: "text", engine: "hnsw" }, image: { embedding: "image", engine: "hnsw" } },
    });
    await dataset.upsertEntities([
      { id: "a", embeddings: { text: [1, 0], image: [1, 0, 0] }, meta: { label: "记忆" } },
      { id: "b", embeddings: { text: [0, 1], image: [0, 1, 0] } },
    ]);
    const fused = await dataset.fuseSearch([{ index: "text", vector: [1, 0] }, { index: "image", vector: [1, 0, 0] }], { topK: 1 });
    assert.equal(fused.results[0]?.id, "a");
    assert.equal(fused.results[0]?.sources?.length, 2);
    await dataset.deleteEntities(["b"]);
    await db.close();
    db = await openVectorDB({ path: directory });
    dataset = await db.openDataset("memory");
    const [entity] = await dataset.fetchEntities(["a"]);
    assert.deepEqual(entity?.meta, { label: "记忆" });
    assert.deepEqual(Array.from(entity.embeddings.image), [1, 0, 0]);
    assert.equal((await dataset.search("text", [1, 0], { topK: 10 })).length, 1);
  } finally {
    await db?.close();
    await rm(directory, { recursive: true, force: true });
  }
});
