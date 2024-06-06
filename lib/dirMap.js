import * as fs from "fs";
import * as path from "path";
/**
 *
 * @private
 * @param {Array<Array<string> | {"path":string,"contents":cont}>} cont
 * @returns { Array<Array<string> | {"path":string,"contents":cont}> }
 */
export const dirMap = (cont) =>
  cont.map((val) =>
    fs.statSync(val).isDirectory()
      ? {
          path: val,
          contents: dirMap(
            fs.readdirSync(val).map((valueInner) => path.join(val, valueInner))
          ),
        }
      : val
  );
/**
 * @description Get a directory map of a path
 * @param { string } path
 * @returns { Array<Array<string> | {"path":string,"contents":recusive}>}
 */
export default (path) => dirMap(fs.readdirSync(path));
/**
 *
 * @param { Array<string> } cont
 * @returns { Array<string> }
 */
const flatdm = (cont) =>
  cont.map((val) =>
    (fs.statSync(val).isDirectory()
      ? [
          val,
          ...flatdm(
            fs.readdirSync(val).map((valueInner) => path.join(val, valueInner))
          ),
        ]
      : val)
  ).flat(1);
/**
 *
 * @param { string } path
 * @returns { Array<string> } An array contaning all of the paths
 */
export const dirMapFlat = (path) => flatdm(fs.readdirSync(path));
/**
 * A directory map
 * @typedef {Array<Array<string> | {"path":string,"contents":dirmapping}>} dirmapping
 * */
