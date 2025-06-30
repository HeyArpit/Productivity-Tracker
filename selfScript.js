document.addEventListener("DOMContentLoaded", () => {

    // === To-Do Elements ===
    const todoInput = document.getElementById("todo-input")
    const addBtn = document.getElementById("add-btn")
    const todoList = document.getElementById("todo-list")

    // === Filter Buttons ===
    const all = document.getElementById("all")
    const completed = document.getElementById("completed")
    const pending = document.getElementById("pending")

    // === Dropdown Toggle ===
    const toggleBtn = document.getElementById("dropdown-toggle")
    const dropdown = document.querySelector(".dropdown-btns")

    // === Pomodoro Timer Elements ===
    const timerDisplay = document.getElementById("timer")
    const startBtn = document.getElementById("start-btn")
    const resetBtn = document.getElementById("reset-btn")


    //Edit Task features0
    let isEditing = false;
    let currentEditId = null;

    // Initial Pomodoro time
    let minutes = 25
    let seconds = 0
    let interval = null
    updateTimerDisplay()  // Show 25:00 at start

    // Load tasks from localStorage and render them
    let taskArray = JSON.parse(localStorage.getItem("taskData")) || []
    taskArray.forEach(task => {
        addTaskToList(task)
    });

    // Add new task to list and localStorage
    addBtn.addEventListener("click", () => {

        const inputValue = todoInput.value.trim();
        if (inputValue === "") return;

        // Check if task with same name already exists (case-insensitive)
        const duplicateTask = taskArray.find(task =>
            task.taskName.toLowerCase() === inputValue.toLowerCase()
        );

        // If editing, allow same name if it's the same task being edited
        if (duplicateTask && (!isEditing || duplicateTask.id !== currentEditId)) {
            alert("⚠️ Task already exists!");
            return;
        }

        if (isEditing) {
            const taskToUpdate = taskArray.find((task) => task.id === currentEditId)
            taskToUpdate.taskName = inputValue

            saveTask(taskArray)
            refreshTask();

            isEditing = false;
            currentEditId = null;
            addBtn.textContent = "Add"
            todoInput.value = ""

            return;

        }

        const taskObject = {
            id: Date.now(),
            taskName: inputValue,
            isCompleted: false
        }


        taskArray.push(taskObject)
        todoInput.value = "";
        addTaskToList(taskObject)
        saveTask(taskArray)


    })

    // Toggle dropdown visibility
    toggleBtn.addEventListener("click", () => {

        dropdown.classList.toggle("show");

    })

    // Filter: Show all tasks
    all.addEventListener("click", (e) => {

        document.querySelectorAll(".list-items").forEach((items) => {
            items.style.display = "flex";
        })

        dropdown.classList.remove("show");

    })

    // Filter: Show only completed tasks
    completed.addEventListener("click", (e) => {

        document.querySelectorAll(".list-items").forEach((items) => {
            if (items.classList.contains("completed")) {
                items.style.display = "flex";
            } else {
                items.style.display = "none"
            }

            dropdown.classList.remove("show");

        })
    })

    // Filter: Show only pending tasks
    pending.addEventListener("click", (e) => {

        document.querySelectorAll(".list-items").forEach((items) => {
            if (!items.classList.contains("completed")) {
                items.style.display = "flex";
            } else {
                items.style.display = "none"
            }

            dropdown.classList.remove("show");

        })
    })

    // Hide dropdown when clicking outside
    document.addEventListener("click", (e) => {
        if (!toggleBtn.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove("show");
        }
    })



    // Add task to the DOM
    function addTaskToList(taskObject) {

        const lists = document.createElement("li");
        const taskDiv = document.createElement("div")
        const btnDiv = document.createElement("div")
        const dltBtn = document.createElement("button");
        const cmpltBtn = document.createElement("button");
        const editIcon = document.createElement("span")

        lists.classList.add("list-items");
        dltBtn.classList.add("dlt-btn");
        cmpltBtn.classList.add("cmpltd-btn");

        taskDiv.textContent = taskObject.taskName;
        cmpltBtn.textContent = "Completed";
        dltBtn.textContent = "Delete";
        editIcon.innerHTML = `<i class="fa-solid fa-file-pen"></i>`

        todoList.appendChild(lists);
        lists.appendChild(taskDiv);
        lists.appendChild(btnDiv);
        btnDiv.appendChild(cmpltBtn)
        btnDiv.appendChild(dltBtn)
        btnDiv.appendChild(editIcon)



        if (taskObject.isCompleted) {
            lists.classList.add("completed")
        }





        dltBtn.addEventListener("click", () => {
            deleteTask(taskObject, lists)
        })

        cmpltBtn.addEventListener("click", () => {
            completedTask(taskObject, lists);
            saveTask(taskArray)
        })

        editIcon.addEventListener("click", () => {
            todoInput.value = taskObject.taskName;
            isEditing = true;
            currentEditId = taskObject.id;
            addBtn.textContent = "Update"

        })
    }



    // Save tasks to localStorage
    function saveTask(taskArray) {
        localStorage.setItem("taskData", JSON.stringify(taskArray))
    }


    // Delete task from UI and localStorage
    function deleteTask(taskObject, lists) {
        taskArray = taskArray.filter((t) => t.id !== taskObject.id)
        lists.remove();
        saveTask(taskArray)
    }

    //Refresh task In localStorage
    function refreshTask() {
        todoList.innerHTML = ""
        taskArray.forEach(task => {
            addTaskToList(task);
        })
    }


    // Toggle completion status of task
    function completedTask(taskObject, lists) {

        taskObject.isCompleted = !taskObject.isCompleted

        lists.classList.toggle("completed")

    }


    // Update the timer display
    function updateTimerDisplay() {
        timerDisplay.textContent = String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")
    }


    // Start Pomodoro countdown
    startBtn.addEventListener("click", () => {
        startBtn.disabled = true;
        if (interval) return;
        interval = setInterval(() => {

            if (seconds > 0) {
                seconds--
            }
            else {
                if (minutes > 0) {
                    minutes--;
                    seconds = 59;
                } else {
                    clearInterval(interval)
                    interval = null
                    startBtn.disabled = false;
                }
            } updateTimerDisplay()

        }, 1000);


    })


    // Reset Pomodoro timer
    resetBtn.addEventListener("click", () => {
        startBtn.disabled = false;

        if (interval) {
            clearInterval(interval)

            interval = null

        }
        minutes = 25;
        seconds = 0;
        updateTimerDisplay()
    })



})