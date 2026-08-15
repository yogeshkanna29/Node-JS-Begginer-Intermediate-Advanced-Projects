import { readdir } from "node:fs/promises";
import path from "path";

const inputPath: string | undefined = process.argv[2];
const folderPath: string = inputPath ? path.resolve(inputPath) : process.cwd();

let entries;

try {
  entries = await readdir(folderPath, { withFileTypes: true });
} catch {
  console.error(`error: could not read folder: ${inputPath || folderPath}`);
  process.exitCode = 1;
}

if (entries) {
  const fileCount = entries.filter((entry) => entry.isFile()).length;
  const folderCount = entries.filter((entry) => entry.isDirectory()).length;

  console.log(`Folder : ${path.basename(folderPath)}`);
  console.log(`Path : ${folderPath}`);
  console.log(`Folder Count : ${folderCount}`);
  console.log(`File Count : ${fileCount}`);
}
