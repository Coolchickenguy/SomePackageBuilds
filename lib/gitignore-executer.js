import anymatch from "anymatch";
import gitignore from "parse-gitignore";
import * as path from "path";
import * as fs from "fs";
import { dirMapFlat } from "./dirMap.js";
/**
 *
 * @param { Array<Array<string> } files
 * @param { string } gitignorePath
 * @returns { Array<string> }
 */
export function getMatches(files, gitignorePath) {
  const gitignoreList = gitignore(gitignorePath);
  const matcher = anymatch(gitignoreList);
  files = files.map((val) => val.replace(/^\/(.*)$/, ""));
  var matches = files.filter(matcher);
  return matches;
}
/**
 *
 * @description Remove files that art told to be in the .gitignore ( Or the .npmignore cuz npm uses the same format )
 * @param { string } dir The path to oparate on
 * @param { string } gitignorePath The path of the .gitignore
 * @param { string } workingDir The directory the paths are relitive to
 */
export function removeMatches(dir, gitignorePath, workingDir) {
  // Create out constants
  const runPath = path.join(workingDir, dir);
  const resolvedGitignorePath = path.join(workingDir, gitignorePath);
  // Get matched files/dirs
  const matches = getMatches(dirMapFlat(runPath), resolvedGitignorePath);
  matches.forEach((val) =>
    fs.rmSync(path.resolve(runPath, val), { recursive: true, force: true })
  );
}
