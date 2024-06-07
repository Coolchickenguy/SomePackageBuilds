import * as fs from "fs";
import { join } from "path";
import { exec } from "child_process";
import patch from "./lib/es_patches.js";
import { stderr, stdout } from "process";
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
        var task = exec(
          "node " + data.file_Name,
          function (error, stdout, stderr) {
            if (error) {
              res({"success":false, ...arguments});
            } else {
              res({"success":true, stdout,stderr});
            }
          }
        );
        task.stdout.pipe(stdout);
        task.stderr.pipe(stderr);
      })
  )
);
fs.writeFileSync("./packages/log.json",JSON.stringify(output));
