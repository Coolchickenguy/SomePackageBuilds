import { pipeline } from "stream/promises";
import unzip from "./unzip.js";
import fix from "./es_patches.js";
import * as tar from "tar";
import { join,basename,dirname } from "path";
import { sync } from "mkdirp";
import { execSync } from "child_process";
import { removeMatches } from "./gitignore-executer.js";
import { dirMapFlat } from "./dirMap.js";
import * as fs from "fs";
export default async function (meta, zipPath) {
  fix(meta);
  const buildDir = join(__dirname, "build");
  fs.rmSync(buildDir, { recursive: true, force: true });
  var output = await fetch(zipPath);
  // Create the build dir
  sync(buildDir);
  await unzip(buildDir, Buffer.from(await output.arrayBuffer())).catch(
    console.error
  );
  console.log("unziped");
  const packageDir = dirname(join(buildDir,dirMapFlat(buildDir).filter((value) => basename(value) === "package.json")[0]));
  console.log(`Debug: building dir ${packageDir}`);
  execSync("npm i", {
    cwd: packageDir,
    stdio: ["inherit", "inherit", "inherit"],
  });
  execSync("npm run build", {
    cwd: packageDir,
    stdio: ["inherit", "inherit", "inherit"],
  });
  // Yes I have heard of npm pack
  console.log("Debug: removeing files from .npmignored");
  removeMatches("./", "./.npmignore", packageDir);
  await pipeline(
    tar.create({ cwd: packageDir, portable: true }, [""]),
    fs.createWriteStream(join(__dirname, "index.tgz"))
  );
  console.log("Done!", "Cleaning up...");
  fs.rmSync(join(__dirname, "build"), { recursive: true, force: true });
  console.log("Finished!");
}