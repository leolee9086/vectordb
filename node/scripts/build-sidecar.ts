import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { parseArgs } from "node:util";

// 与根 Go 模块一起构建，发布包只携带可执行文件，安装方不需要 Go 工具链。
const root = fileURLToPath(new URL("../../", import.meta.url));
// 本地受限执行环境可把测试产物放到工作区外；发布构建仍写入包内 bin。
const { values } = parseArgs({ options: { all: { type: "boolean" }, "out-dir": { type: "string" } } });
const bin = values["out-dir"] ? resolve(values["out-dir"]) : fileURLToPath(new URL("../bin/", import.meta.url));
const targets = [
  { goos: "windows", goarch: "amd64", suffix: "win32-x64.exe" },
  { goos: "linux", goarch: "amd64", suffix: "linux-x64" },
  { goos: "linux", goarch: "arm64", suffix: "linux-arm64" },
  { goos: "darwin", goarch: "amd64", suffix: "darwin-x64" },
  { goos: "darwin", goarch: "arm64", suffix: "darwin-arm64" },
];
const all = values.all;
const selected = all ? targets : targets.filter(target => target.suffix === `${process.platform}-${process.arch}${process.platform === "win32" ? ".exe" : ""}`);
if (!selected.length) throw new Error(`暂不支持 ${process.platform}/${process.arch}`);
mkdirSync(bin, { recursive: true });
for (const target of selected) {
  const output = resolve(bin, `vectordb-sidecar-${target.suffix}`);
  const result = spawnSync("go", ["build", "-trimpath", "-ldflags=-s -w", "-o", output, "./cmd/vectordb-sidecar"], {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, CGO_ENABLED: "0", GOOS: target.goos, GOARCH: target.goarch },
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
  console.log(`已构建 ${target.goos}/${target.goarch}`);
}
