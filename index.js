import { Task, STATUS } from "./schema.js";
import Table from "cli-table";
import { Argument, Command, program } from "commander";
import { Client } from "./db.js";

program.version("0.0.1").description("Task Manager");

const client = Client("database.json");

program.command("add <string>").action((str) => {
  const data = client.getData();

  const id = +data.count + 1;

  const task = new Task({
    id,
    description: str,
    status: STATUS.todo,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const newData = {
    count: id,
    data: [...data.data, task],
  };

  client.updateData(newData);
  process.stdout.write(`Task added successfully: (ID: ${id})\n`);
});

program.command("update <id> <string>").action((id, str) => {
  const task = client.getTask(id);
  if (!task) {
    process.stdout.write(`Task with ID ${id} not found\n`);
    return;
  }

  task.description = str;

  const data = client.getData();
  const newData = {
    count: data.count,
    data: [...data.data.filter((item) => item.id.toString() !== id), task],
  };

  client.updateData(newData);

  process.stdout.write(`Task updated successfully: (ID: ${id})\n`);
});

program.command("delete <id>").action((id) => {
  const task = client.getTask(id);
  if (!task) {
    process.stdout.write(`Task with ID ${id} not found\n`);
    return;
  }

  const data = getData();
  const newData = {
    count: data.count,
    data: data.data.filter((item) => item.id.toString() !== id),
  };

  client.updateData(newData);

  process.stdout.write(`Task deleted successfully: (ID: ${id})\n`);
});

program.command("mark-done <id>").action((id) => {
  const task = client.getTask(id);
  if (!task) {
    process.stdout.write(`Task with ID ${id} not found\n`);
    return;
  }

  task.status = STATUS.done;

  task.updatedAt = new Date();
  const data = client.getData();
  const newData = {
    count: data.count,
    data: [...data.data.filter((item) => item.id.toString() !== id), task],
  };

  client.updateData(newData);
  process.stdout.write(`Task updated successfully: (ID: ${id})\n`);
});

program.command("mark-in-progress <id>").action((id) => {
  const task = client.getTask(id);
  if (!task) {
    process.stdout.write(`Task with ID ${id} not found\n`);
    return;
  }

  task.status = STATUS.inProgress;

  task.updatedAt = new Date();
  const data = client.getData();
  const newData = {
    count: data.count,
    data: [...data.data.filter((item) => item.id.toString() !== id), task],
  };

  client.updateData(newData);
  process.stdout.write(`Task updated successfully: (ID: ${id})\n`);
});

program
  .command("list")
  .addArgument(
    new Argument("[status]").choices(["todo", "in-progress", "done"]),
  )
  .action((status) => {
    const data = client.getData();
    const table = new Table({
      head: ["ID", "Description", "Status", "Created At", "Updated At"],
    });

    if (status) {
      data.data = data.data.filter((task) => task.status === status);
    }

    data.data.forEach((task) => {
      table.push([
        task.id,
        task.description,
        task.status,
        task.createdAt,
        task.updatedAt,
      ]);
    });

    process.stdout.write(table.toString());
  });

program.parse(process.argv);
