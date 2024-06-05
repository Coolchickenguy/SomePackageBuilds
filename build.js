import * as fs from "fs";
import { join } from "path";
import { execSync } from "child_process";
import patch from "./lib/es_patches.js";
patch(import.meta);
var builders_dir = join(__dirname,"packages");
var builders = fs.readdirSync(builders_dir).map(folder => {return { "file_Name" : "build.js", "run_at" : join(builders_dir,folder)}});
builders.forEach(data => {execSync("node " + data.file_Name, { cwd: data.run_at, stdio: ["inherit", "inherit", "inherit"] });});