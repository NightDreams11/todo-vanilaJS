const input = document.getElementById("todo__input")
const tasksContainer = document.getElementById("todo__tasks")
const burgerBtn = document.getElementById("burger-btn")

const state = JSON.parse(localStorage.getItem("todos")) || {}
const iconsClasses = {
  done: "fa-solid fa-check fa-pause todo__check-icon",
  hold: "fa-solid fa-pause todo__hold-icon",
  process: "fa-solid fa-gear todo__process-icon",
}

if (Object.keys(state).length !== 0) {
  const arr = []
  for (const key in state) {
    arr.push(key)
  }
  let max = Math.max(...arr)

  for (let i = 0; i < max + 1; i++) {
    if (state[i]) {
      const todoTask = document.createElement("li")
      const deleteSpan = document.createElement("span")
      const icon = document.createElement("span")
      todoTask.className = state[i].class
      deleteSpan.className = "fa-solid fa-delete-left todo__delete-icon"
      icon.className = iconsClasses[state[i].status]
      todoTask.innerHTML = state[i].text
      todoTask.id = state[i].id
      tasksContainer.append(todoTask)
      todoTask.append(deleteSpan, icon)
    }
  }
}

const addTask = () => {
  if (input.value === "") {
    alert("The input is empty")
  } else {
    const todoTask = document.createElement("li")
    const deleteSpan = document.createElement("span")
    const holdIcon = document.createElement("span")

    todoTask.className = "todo__task todo__task_hold"
    deleteSpan.className = "fa-solid fa-delete-left todo__delete-icon"
    holdIcon.className = "fa-solid fa-pause todo__hold-icon"

    todoTask.innerHTML = input.value
    tasksContainer.append(todoTask)
    todoTask.append(deleteSpan, holdIcon)

    todoTask.id = tasksContainer.children.length
    state[todoTask.id] = {
      id: todoTask.id,
      status: "hold",
      text: todoTask.textContent,
      class: todoTask.className,
    }
  }
  input.value = ""
  localStorage.setItem("todos", JSON.stringify(state))
}

burgerBtn.addEventListener("click", function (e) {
  const burger = document.getElementById("header__burger")

  if (burger.classList.contains("header__burger_open")) {
    burger.classList.remove("header__burger_open")
  } else {
    burger.classList.add("header__burger_open")
  }
})

tasksContainer.addEventListener("click", function (e) {
  const target = e.target
  const currentStatus = state[target.id]?.status
  if (currentStatus === "hold") {
    //to process
    state[target.id].status = "process"
    e.target.classList.remove("todo__task_hold")
    e.target.classList.add("todo__task_process")
    state[target.id].class = target.className

    const childrenWithClass = target.getElementsByClassName("todo__hold-icon")
    const holdIcon = childrenWithClass[0]
    target.removeChild(holdIcon)

    const processIcon = document.createElement("span")
    processIcon.className = "fa-solid fa-gear todo__process-icon"
    target.append(processIcon)
  } else if (currentStatus === "process") {
    //to done
    state[target.id].status = "done"
    e.target.classList.remove("todo__task_process")
    e.target.classList.add("todo__task_done")
    state[target.id].class = target.className

    const childrenWithClass =
      target.getElementsByClassName("todo__process-icon")
    const processIcon = childrenWithClass[0]
    target.removeChild(processIcon)

    const doneIcon = document.createElement("span")
    doneIcon.className = "fa-solid fa-check todo__check-icon"
    target.append(doneIcon)
  } else if (currentStatus === "done") {
    //to hold
    state[target.id].status = "hold"
    e.target.classList.remove("todo__task_done")
    e.target.classList.add("todo__task_hold")
    state[target.id].class = target.className

    const childrenWithClass = target.getElementsByClassName("todo__check-icon")

    const doneIcon = childrenWithClass[0]
    target.removeChild(doneIcon)

    const holdIcon = document.createElement("span")
    holdIcon.className = "fa-solid fa-pause todo__hold-icon"
    target.append(holdIcon)
  }

  if (
    target.tagName === "SPAN" &&
    target.classList.contains("todo__delete-icon")
  ) {
    delete state[target.parentElement.id]
    target.parentElement.remove()
  }

  localStorage.setItem("todos", JSON.stringify(state))
})
