function Task({ id, description, status, createdAt, updatedAt }) {
  this.id = id;
  this.description = description;
  this.status = status;
  this.createdAt = createdAt;
  this.updatedAt = updatedAt;
}

const STATUS = {
  todo: "todo",
  inProgress: "in-progress",
  done: "done",
};

export { Task, STATUS };
