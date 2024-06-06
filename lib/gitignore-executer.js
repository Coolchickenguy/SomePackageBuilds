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
export async function removeMatches(dir,gitignorePath,workingDir){
    // Create out constants
    const runPath = path.join(workingDir,dir);
    const resolvedGitignorePath = fs.readFileSync(path.join(workingDir,gitignorePath));
    // Genarate dir map
    const files = getMatches(dirMapFlat(runPath),resolvedGitignorePath);
    // Get matched files/dirs
    const matches = getMatches(files,resolvedGitignorePath);
    matches.forEach(val => rm(val,{"recursive":true,"force":true}).catch(e => {console.error(e.toString())}));
}