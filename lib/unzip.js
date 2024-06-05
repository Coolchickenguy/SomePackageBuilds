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
/*
Old:
fromBuffer(file, { lazyEntries: true }, function (err, zipfile) {
    if (err) throw err;
    zipfile.readEntry();
    zipfile.on("entry", function (entry) {
      if (/\/$/.test(entry.fileName)) {
        // Directory file names end with '/'.
        // Note that entries for directories themselves are optional.
        // An entry's fileName implicitly requires its parent directories to exist.
        sync(join(folder, entry.fileName));
        zipfile.readEntry();
      } else {
        // file entry
        zipfile.openReadStream(entry, function (err, readStream) {
          if (err) throw err;
          var fileStream = fs.createWriteStream(join(folder, entry.fileName));
          readStream.pipe(fileStream);
          fileStream.on("finish", () => {
            fileStream.close(() => {
              zipfile.readEntry();
            });
            file.on('error', (err) => {
                throw err;
            });
          });
        });
      }
    });
  });
*/
