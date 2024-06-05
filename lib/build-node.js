import { pipeline } from "stream/promises";
import unzip from "./unzip.js";
import fix from "./es_patches.js";
import * as tar from "tar";
import { join } from "path";
import { sync } from "mkdirp";
import { execSync } from "child_process";
import * as fs from "fs";
export default async function(meta,zipPath){
fix(meta);
var build_dir = join(__dirname, "build");
fs.rmSync(build_dir, { recursive: true, force: true });
var output = await fetch(
  zipPath
);
sync(build_dir);
await unzip(build_dir, Buffer.from(await output.arrayBuffer())).catch(
  console.error
);
console.log("unziped");
while (!fs.existsSync(join(build_dir, "package.json"))) {
  build_dir = join(
    build_dir,
    fs
      .readdirSync(build_dir)
      .filter((dirORfile) =>
        fs.statSync(join(build_dir, dirORfile)).isDirectory()
      )[0]
  );
}
console.log(`Debug: building dir ${build_dir}`);
execSync("npm i", { cwd: build_dir, stdio: ["inherit", "inherit", "inherit"] });
execSync("npm run build", {
  cwd: build_dir,
  stdio: ["inherit", "inherit", "inherit"],
});
await pipeline(
  tar.create([build_dir]),
  fs.createWriteStream(join(__dirname, "built.tgz"))
);
console.log("Done!", "Cleaning up...");
fs.rmSync(join(__dirname, "build"), { recursive: true, force: true });
console.log("Finished!");
}