import { sync } from "mkdirp";
import { join } from "path";
import { pipeline } from "stream/promises";
import * as fs from "fs";
import { fromBuffer } from "yauzl-promise";
/**
 *
 * @param { string } folder
 * @param { Buffer } file
 */
export default async function (folder, file) {
  sync(folder);
  var unziped = await fromBuffer(file);
  for await (const entry of unziped) {
    if (/\/$/.test(entry.filename)) {
      sync(join(folder, entry.filename));
    } else {
      // file entry
      var readStream = await entry.openReadStream();
      var fileStream = fs.createWriteStream(join(folder, entry.filename));
      await pipeline(readStream, fileStream);
    }
  }
}
