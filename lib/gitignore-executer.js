import micromatch from "micromatch";
import gitignore from "parse-gitignore";
import * as path from "path";
import * as fs from "fs";
import { rm } from "fs/promises"
import { dirMapFlat } from "./dirMap.js";
/**
 * 
 * @param { Array<Array<string> } files 
 * @param { string } gitignorePath
 * @returns { Array<string> }
 */
export function getMatches(files,gitignorePath){
    // Create out constants
    const gitignoreList = gitignore(fs.readFileSync(gitignorePath)).sections.map(value => value.patterns).flat(Infinity);
    const matches = micromatch(files,gitignoreList);
    return matches;
}
/**
 * 
 * @description Remove files that art told to be in the .gitignore ( Or the .npmignore cuz npm uses the same format )
 * @param { string } dir The directory the paths are relitive to
 * @param { string } gitignorePath The path of the .gitignore
 * @param { string } workingDir The path to oparate on
 */
export async function removeMatches(dir,gitignorePath,workingDir){
    // Create out constants
    const runPath = path.join(workingDir,dir);
    const resolvedGitignorePath = path.join(workingDir,gitignorePath);
    console.log(runPath,resolvedGitignorePath)
    // Get matched files/dirs
    const matches = getMatches(dirMapFlat(runPath),resolvedGitignorePath);
    matches.forEach(val => rm(val,{"recursive":true,"force":true}).catch(e => {console.error(e.toString())}));
}