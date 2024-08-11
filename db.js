import * as fs from "fs";

export function Client(path) {
  const getData = () => {
    const file = fs.readFileSync(path);
    return JSON.parse(file);
  };

  const updateData = (newData) => {
    newData.data = newData.data.sort((a, b) => a.id - b.id);
    fs.writeFileSync(path, JSON.stringify(newData));
  };

  const getTask = (id) =>
    getData().data.find((task) => task.id.toString() === id.toString());

  return { getData, updateData, getTask };
}
