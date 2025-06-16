document.addEventListener("DOMContentLoaded", () => {

    const todoInput = document.getElementById("todo-input")
    const addBtn = document.getElementById("add-btn")
    const todoList = document.getElementById("todo-list")


    let taskArray = JSON.parse(localStorage.getItem("taskData")) || []

    taskArray.forEach(task => {
        addTaskToList(task)
    });



    addBtn.addEventListener("click", () => {

        const inputValue = todoInput.value.trim();
        if (inputValue === "") return;

        const taskObject = {
            id: Date.now(),
            taskName: inputValue,
            isCompleted: false
        }

        console.log(taskObject)
        taskArray.push(taskObject)
        console.log(taskArray)
        addTaskToList(taskObject)
        saveTask(taskArray)


    })

    function addTaskToList(taskObject) {

        const lists = document.createElement("li");
        const dltBtn = document.createElement("button");
        const cmpltBtn = document.createElement("button");

        lists.setAttribute("id", "lists");
        dltBtn.setAttribute("id", "dlt-btn");
        cmpltBtn.setAttribute("id", "cmpltd-btn");

        lists.textContent = taskObject.taskName;
        cmpltBtn.textContent = "Completed";
        dltBtn.textContent = "Delete";

        todoList.appendChild(lists);
        lists.appendChild(cmpltBtn);
        lists.appendChild(dltBtn);

        if (taskObject.isCompleted) {
            lists.classList.add("completed")
        }



        todoInput.value = "";

        dltBtn.addEventListener("click", () => {
            deleteTask(taskObject, lists)
        })

        cmpltBtn.addEventListener("click", () => {
            completedTask(taskObject, lists);
            saveTask(taskArray)
        })
    }

    function saveTask(taskArray) {
        localStorage.setItem("taskData", JSON.stringify(taskArray))
    }



    function deleteTask(taskObject, lists) {
        taskArray = taskArray.filter((t) => t.id !== taskObject.id)
        lists.remove();
        saveTask(taskArray)
        console.log("After Deletion: ", taskArray)


    }

    function completedTask(taskObject, lists) {

        taskObject.isCompleted = !taskObject.isCompleted

        lists.classList.toggle("completed")

    }


})