#!/usr/bin/env bun

import { writeFile } from "fs/promises";
import { resolve } from "path";
import { versionTemplate } from "../lib/versionTemplate";

const versionsDir = resolve(__dirname, "../versions");
let version = process.argv[2];
if (!version.startsWith("v")) {
  version = `v${version}`;
}
const versionPath = resolve(versionsDir, `${version}.json`);

await writeFile(versionPath, JSON.stringify(versionTemplate, null, 2), "utf8");
