import { readFile, writeFile, access } from "node:fs/promises";

interface Task {
  id: number;
  description: string;
  status: "todo" | "in-progress" | "done";
  createdAt: string;
  updatedAt: string;
}

const FILE_NAME = "tasks.json";

const inputOption = process.argv.slice(2);

/** Read tasks from JSON File */

async function getTasks(): Promise<Task[]> {
  try {
    await access(FILE_NAME);
    const data = await readFile(FILE_NAME, "utf-8");
    if (!data.trim()) {
      return [];
    }
    return JSON.parse(data);
  } catch (error: any) {
    // File doesn't exist
    if (error.code === "ENOENT") {
      await writeFile(FILE_NAME, "[]", "utf-8");
      return [];
    }

    console.error("Error reading tasks.json");
    process.exitCode = 1;
    return [];
  }
}

/** Save tasks to JSON file */

async function saveTasks(tasks: Task[]): Promise<void> {
  await writeFile(FILE_NAME, JSON.stringify(tasks, null, 2), "utf-8");
}

/** Add Task */

async function addTask(description: string) {
  if (!description) {
    console.error("Error: Task description is required.");
    return;
  }

  const tasks = await getTasks();

  const newId =
    tasks.length === 0 ? 1 : Math.max(...tasks.map((task) => task.id)) + 1;

  const now = new Date().toISOString();

  const newTask: Task = {
    id: newId,
    description,
    status: "todo",
    createdAt: now,
    updatedAt: now,
  };

  tasks.push(newTask);

  await saveTasks(tasks);

  console.log(`Task added successfully. ID: ${newId}`);
}

/** Update task */

async function updateTask(id: number, description: string) {
  if (!description) {
    console.error("Error: Task description is required.");
    return;
  }

  const tasks = await getTasks();

  const task = tasks.find((task) => task.id === id);

  if (!task) {
    console.error(`Error: Task with ID ${id} not found.`);
    return;
  }

  task.description = description;
  task.updatedAt = new Date().toISOString();

  await saveTasks(tasks);
  console.log(`Task ${id} updated successfully.`);
}

/** Delete task */

async function deleteTask(id: number) {
  const tasks = await getTasks();

  const taskExists = tasks.some((task) => task.id === id);

  if (!taskExists) {
    console.error(`Error: Task with ID ${id} not found.`);
    return;
  }

  const updatedTasks = tasks.filter((task) => task.id !== id);

  await saveTasks(updatedTasks);
  console.log(`Task ${id} deleted successfully.`);
}

/** Change task status */

async function updateStatus(
  id: number,
  status: "todo" | "in-progress" | "done",
) {
  const tasks = await getTasks();

  const task = tasks.find((task) => task.id === id);

  if (!task) {
    console.error(`Error: Task with ID ${id} not found.`);
    return;
  }

  task.status = status;
  task.updatedAt = new Date().toISOString();

  await saveTasks(tasks);

  console.log(`Task ${id} marked as ${status}.`);
}

/** List tasks */

async function listTasks(status?: Task["status"]) {
  const tasks = await getTasks();

  const filteredTasks = status
    ? tasks.filter((task) => task.status === status)
    : tasks;

  if (filteredTasks.length === 0) {
    console.log("No tasks found.");
    return;
  }

  for (const task of filteredTasks) {
    console.log(`${task.id}. ${task.description} [${task.status}]`);
  }
}

/** CLI */

async function main() {
  const command = process.argv[2];

  switch (command) {
    case "add": {
      const description = process?.argv[3];
      if (!description) {
        console.error(`error - Task description is required`);
        return;
      }
      await addTask(description);
      break;
    }

    case "update": {
      const id = Number(process?.argv[3]);
      const description = String(process?.argv[4]);

      if (Number.isNaN(id)) {
        console.error("Error: Invalid task ID.");
        return;
      }

      await updateTask(id, description);
      break;
    }

    case "delete": {
      const id = Number(process.argv[3]);

      if (Number.isNaN(id)) {
        console.error("Error: Invalid task ID.");
        return;
      }

      await deleteTask(id);
      break;
    }

    case "mark-in-progress": {
      const id = Number(process.argv[3]);

      if (Number.isNaN(id)) {
        console.error("Error: Invalid task ID.");
        return;
      }

      await updateStatus(id, "in-progress");
      break;
    }

    case "mark-done": {
      const id = Number(process.argv[3]);

      if (Number.isNaN(id)) {
        console.error("Error: Invalid task ID.");
        return;
      }

      await updateStatus(id, "done");
      break;
    }

    case "list":
      await listTasks();
      break;

    case "list-done":
      await listTasks("done");
      break;

    case "list-todo":
      await listTasks("todo");
      break;

    case "list-in-progress":
      await listTasks("in-progress");
      break;

    default:
      console.log(`
Task Tracker

Usage:

  add <description>
  update <id> <description>
  delete <id>
  mark-in-progress <id>
  mark-done <id>
  list
  list-done
  list-todo
  list-in-progress
      `);
  }
}

main();
