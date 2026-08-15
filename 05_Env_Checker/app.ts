import dotenv from "dotenv";
dotenv.config();

const requiredNames: string[] = process.argv.slice(2);

function printError(message: string): void {
  console.error(`error - ${message}`);
  process.exitCode = 1;
}

function getMissingNames(names: string[]): string[] {
  return names.filter((name: string) => !process.env[name]);
}

function printSuccess(names: string[]): void {
  for (const name of names) {
    console.log(`Set: ${name}`);
  }

  console.log("All required environment variables are set.");
}

function main(): void {
  if (requiredNames.length === 0) {
    printError("please provide at least one environment variable name");
    return;
  }

  const missingNames: string[] = getMissingNames(requiredNames);

  if (missingNames.length > 0) {
    printError(`missing environment variables: ${missingNames.join(", ")}`);
    return;
  }

  printSuccess(requiredNames);
}

main();
