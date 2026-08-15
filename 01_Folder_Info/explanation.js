// Import the readdir function from Node.js's built-in "fs/promises" module.
// readdir() is used to read the contents of a folder.
import { readdir } from "node:fs/promises";

// Import Node.js's built-in "path" module.
// path provides useful functions for working with file and folder paths.
import path from "node:path";


// process.argv contains the command-line arguments passed when running the Node.js program.
//
// Example:
// node app.js ./test
//
// process.argv looks roughly like:
// [
//   "/path/to/node",     // process.argv[0] -> Node.js executable
//   "/path/to/app.js",   // process.argv[1] -> your JavaScript file
//   "./test"             // process.argv[2] -> first argument you provide
// ]
//
// So process.argv[2] means:
// "Give me the first argument provided by the user."
const inputPath = process.argv[2];


// If the user provided a folder path:
//     path.resolve(inputPath)
// converts it into an absolute path.
//
// Example:
// inputPath = "./test"
// path.resolve(inputPath)
// -> "/home/yogesh/project/test"
//
// If the user DID NOT provide a path:
//     process.cwd()
// returns the current working directory.
//
// Example:
// If you run:
// node app.js
//
// from:
// /home/yogesh/project
//
// process.cwd() returns:
// /home/yogesh/project
//
// So this line means:
// "Use the path given by the user, otherwise use the current folder."
const folderPath = inputPath ? path.resolve(inputPath) : process.cwd();


// Create a variable to store the folder contents.
// We don't assign a value yet because we will assign it inside try.
let entries;


try {

  // readdir() reads everything inside the folder.
  //
  // folderPath = the folder we want to read.
  //
  // { withFileTypes: true } is important.
  //
  // Normally:
  // readdir(folderPath)
  //
  // gives you names like:
  // ["app.js", "test", "package.json"]
  //
  // But withFileTypes: true gives you Dirent objects.
  // These objects allow us to check:
  // entry.isFile()
  // entry.isDirectory()
  //
  // Example:
  // [
  //   Dirent { name: "app.js", ... },
  //   Dirent { name: "test", ... }
  // ]
  entries = await readdir(folderPath, { withFileTypes: true });


} catch {

  // If reading the folder fails, this code runs.
  //
  // For example:
  // - folder doesn't exist
  // - permission denied
  // - invalid path
  //
  // inputPath || folderPath
  //
  // means:
  // "Use inputPath if it exists, otherwise use folderPath."
  console.error(`error: could not read folder: ${inputPath || folderPath}`);


  // process.exitCode = 1 tells Node.js:
  // "The program finished with an error."
  //
  // 0 usually means success.
  // 1 usually means an error occurred.
  //
  // We don't immediately stop the process here.
  // We simply set the exit code to 1.
  process.exitCode = 1;
}


// Check whether entries actually contains data.
//
// If readdir() succeeded:
//     entries = [...]
//
// So this condition becomes true.
//
// If readdir() failed:
//     entries remains undefined
//
// So this condition prevents us from trying to use undefined.
if (entries) {


  // entries.filter() creates a new array containing only the entries
  // that satisfy the condition.
  //
  // entry.isFile() returns true if the entry is a FILE.
  //
  // Example:
  //
  // entries:
  // [
  //   app.js       -> file
  //   package.json -> file
  //   src          -> folder
  // ]
  //
  // After filter:
  // [
  //   app.js,
  //   package.json
  // ]
  //
  // .length gives us the number of files.
  const fileCount = entries.filter((entry) => entry.isFile()).length;


  // Same idea as above, but this time we check for folders.
  //
  // entry.isDirectory() returns true if the entry is a folder.
  //
  // Example:
  //
  // entries:
  // [
  //   app.js -> file
  //   src    -> folder
  //   test   -> folder
  // ]
  //
  // folderCount becomes 2.
  const folderCount = entries.filter((entry) => entry.isDirectory()).length;


  // path.basename() gets the last part of a path.
  //
  // Example:
  // folderPath:
  // "/home/yogesh/projects/myapp"
  //
  // path.basename(folderPath):
  // "myapp"
  //
  // So this prints the folder name.
  console.log(`Folder ${path.basename(folderPath)}`);


  // Prints the complete absolute path of the folder.
  //
  // Example:
  // Path /home/yogesh/projects/myapp
  console.log(`Path ${folderPath}`);


  // Prints how many files were found.
  console.log(`Files : ${fileCount}`);


  // Prints how many folders were found.
  console.log(`Folders : ${folderCount}`);
}