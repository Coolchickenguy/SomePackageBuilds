import * as fs from "fs";
import { join } from "path";
import { exec } from "child_process";
import patch from "./lib/es_patches.js";
patch(import.meta);
var builders_dir = join(__dirname, "packages");
var builders = fs
  .readdirSync(builders_dir)
  .filter((folder) => fs.statSync(folder).isDirectory())
  .map((folder) => {
    return { file_Name: "build.js", run_at: join(builders_dir, folder) };
  });
var output = await Promise.all(
  builders.map(
    (data) =>
      new Promise((res) => {
        exec(
          "node " + data.file_Name,
          {
            cwd: data.run_at,
            stdio: ["inherit", "inherit", "inherit"],
          },
          function (error, stdout, stderr) {
            if (error) {
              res({"success":false, ...arguments});
            } else {
              res({"success":true, stdout,stderr});
            }
          }
        );
      })
  )
);
fs.writeFileSync("./packages/log.json",JSON.stringify(output));
