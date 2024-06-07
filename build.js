import * as fs from "fs";
import { join } from "path";
import { exec, spawn } from "child_process";
import patch from "./lib/es_patches.js";
patch(import.meta);
var builders_dir = join(__dirname, "packages");
var builders = fs
  .readdirSync(builders_dir)
  .filter((folder) => fs.statSync(join(builders_dir, folder)).isDirectory())
  .map((folder) => {
    return { file_Name: "build.js", run_at: join(builders_dir, folder) };
  });
var output = await Promise.all(
  builders.map(
    (data) =>
      new Promise((res) => {
        var outputs = { stdout: "none", stderr: "none" };
        var task = spawn("node",[data.file_Name], {
          cwd: data.run_at,
        });
        task.stdout.on("data", (chunk) => {
          process.stdout.write(chunk);
          if (outputs.stdout === "none") {
            outputs.stdout = Buffer.from(chunk);
          } else {
            outputs.stdout = Buffer.concat([outputs.stdout, Buffer.from(chunk)]);
          }
        });
        task.stderr.on("data", (chunk) => {
          process.stderr.write(chunk);
          if (outputs.stderr === "none") {
            outputs.stderr = Buffer.from(chunk);
          } else {
            outputs.stderr = Buffer.concat(outputs.stderr, Buffer.from(chunk));
          }
        });
        task.on("exit", (code) => {
          res({ code, ...outputs });
        });
      })
  )
);
fs.writeFileSync("./packages/log.json", JSON.stringify(output));
