import { readFile } from "node:fs/promises";

const filePath = process.argv[2];

function printError(message: string) {
  console.error(`error - ${message}`);
  process.exitCode = 1;
}

interface jsonFormat {
  text: string;
  filePath: string;
}

function formatJson({ text, filePath }: jsonFormat) {
  let value;

  try {
    value = JSON.parse(text);
  } catch {
    printError(`Invalid JSON in file : ${filePath}`);
    return null;
  }
  return JSON.stringify(value, null, 2);
}

async function main() {
  if (!filePath) {
    printError("please provide a JSON file path");
    return;
  }
  let text;
  try {
    text = await readFile(filePath, "utf8");
  } catch {
    printError(`could not read file: ${filePath}`);
    return;
  }
  const formattedJson = formatJson({text, filePath});
  if (formattedJson === null) {
    return;
  }
  console.log(formattedJson);
}
await main();
