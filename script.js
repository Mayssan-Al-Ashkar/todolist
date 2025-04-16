document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const dateInput = document.getElementById("due-date-input");
  const addBtn = document.getElementById("add-task-btn");
  const taskList = document.getElementById("task-list");
  const filterButtons = document.querySelectorAll(".filter-btn");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const getCurrentFilter = () => {
    const activeBtn = document.querySelector(".filter-btn.active");
    return activeBtn ? activeBtn.dataset.filter : "all";
  };

  const renderTasks = (filter = "all") => {
    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(task => {
      if (filter === "all") return true;
      if (filter === "completed") return task.completed;
      if (filter === "pending") return !task.completed;
    });

    filteredTasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = "task-item";
      if (task.completed) {
        li.classList.add("completed");
      }

      let dueDateDisplay = "";
if (task.dueDate) {
  const formattedDate = new Date(task.dueDate).toLocaleDateString();
  dueDateDisplay = `<small class="due-date">(Due: ${formattedDate})</small>`;
}


      li.innerHTML = `
        <div>
          <span onclick="app.toggleTask(${index})">${task.title}</span>
          ${dueDateDisplay}
        </div>
        <div class="task-buttons">
          <button onclick="app.toggleTask(${index})">✔</button>
          <button onclick="app.deleteTask(${index})">🗑️</button>
        </div>
      `;

      taskList.appendChild(li);
    });
  };

  const addTask = () => {
    const taskTitle = taskInput.value.trim();
    const dueDate = dateInput.value;

    if (!taskTitle) return;

    tasks.push({ title: taskTitle, completed: false, dueDate });
    taskInput.value = "";
    dateInput.value = "";
    saveTasks();
    renderTasks(getCurrentFilter());
  };

  const toggleTask = (index) => {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks(getCurrentFilter());
  };

  const deleteTask = (index) => {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks(getCurrentFilter());
  };

  const setFilter = (filter) => {
    filterButtons.forEach(btn =>
      btn.classList.toggle("active", btn.dataset.filter === filter)
    );
    renderTasks(filter);
  };

  // Event Listeners
  addBtn.addEventListener("click", addTask);
  taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTask();
  });

  filterButtons.forEach(btn =>
    btn.addEventListener("click", () => setFilter(btn.dataset.filter))
  );

  // Expose for inline HTML events
  window.app = { toggleTask, deleteTask };

  // Initial Render
  renderTasks();
});
