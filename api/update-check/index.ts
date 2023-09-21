import { VercelRequest, VercelResponse } from "@vercel/node";
import { readFile } from "fs/promises";
import { resolve } from "path";

const sendError = (response: VercelResponse) => {
  // NOTE: 本家のAPIはapplication/jsonで生テキストを送ってくる。クソ
  return response.status(200).setHeader("Content-Type", "application/json").send("malformed version");
};

export default async (request: VercelRequest, response: VercelResponse) => {
  console.log(request.headers, request.query);

  const version = request.query.version;
  if (!version) {
    sendError(response);
    return;
  }

  const versionFile = resolve(process.cwd(), "dist", "versions", `${version}.json`);
  try {
    const versionJson = await readFile(versionFile, "utf8");
    response.status(200).setHeader("Content-Type", "application/json").send(versionJson);
  } catch(e) {
    console.error(e);

    const json = { "updatesAvailable": [] };
    response.status(200).setHeader("Content-Type", "application/json").send(JSON.stringify(json));
  }
};