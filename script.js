const apiBase = "http://localhost:3000"; // Base URL for the API

// DOM Elements
const taskForm = document.getElementById("taskForm");
const taskName = document.getElementById("taskName");
const categorySelect = document.getElementById("category");
const prioritySelect = document.getElementById("priority");
const taskTable = document.getElementById("taskTable");

// Load categories and priorities
const loadCategoriesAndPriorities = async () => {
    try {
        // Fetch categories
        const categoriesRes = await fetch(`${apiBase}/categories`);
        const categories = await categoriesRes.json();
        categorySelect.innerHTML = categories.map(cat =>
            `<option value="${cat.category_id}">${cat.category_description}</option>`
        ).join("");

        // Fetch priorities
        const prioritiesRes = await fetch(`${apiBase}/priorities`);
        const priorities = await prioritiesRes.json();
        prioritySelect.innerHTML = priorities.map(pri =>
            `<option value="${pri.priority_id}">${pri.priority_description}</option>`
        ).join("");
    } catch (error) {
        console.error("Error loading categories or priorities:", error);
    }
};

// Load tasks into the table
const loadTasks = async () => {
    try {
        const res = await fetch(`${apiBase}/tasks`);
        const tasks = await res.json();
        taskTable.innerHTML = tasks.map(task => `
            <tr>
                <td>${task.task_name}</td>
                <!-- Add dynamic class for category -->
                <td class="${getCategoryClass(task.category_description)}">${task.category_description}</td>
                <!-- Add dynamic class for priority -->
                <td class="${getPriorityClass(task.priority_description)}">${task.priority_description}</td>
                <td>${task.task_added}</td>
                <td>${task.task_completed || "Not Completed"}</td>
                <td>
                    <!-- Pass the task ID to the completeTask function -->
                    <button onclick="completeTask(${task.task_id})">Complete</button>
                    <button onclick="deleteTask(${task.task_id})">Delete</button>
                </td>
            </tr>
        `).join("");
    } catch (error) {
        console.error("Error loading tasks:", error);
    }
};



// Function to get category-specific CSS class
const getCategoryClass = (categoryDescription) => {
    switch (categoryDescription.toLowerCase()) {
        case 'work':
            return 'category-work';
        case 'fun':
            return 'category-fun';
        case 'home':
            return 'category-home';
        case 'study':
            return 'category-study';    
        default:
            return '';
    }
};

// Function to get priority-specific CSS class
const getPriorityClass = (priorityDescription) => {
    switch (priorityDescription.toLowerCase()) {
        case 'high':
            return 'priority-high';
        case 'normal':
            return 'priority-normal';
        case 'low':
            return 'priority-low';
        default:
            return '';
    }
};

// Add a new task
taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
        const newTask = {
            task_name: taskName.value,
            category_id: categorySelect.value,
            priority_id: prioritySelect.value,
            task_completed: null
        };
        await fetch(`${apiBase}/tasks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTask)
        });
        taskForm.reset();
        loadTasks();
    } catch (error) {
        console.error("Error adding task:", error);
    }
});

// Mark a task as completed
const completeTask = async (id) => {
    console.log(`Completing task with ID: ${id}`); // Check if the function is called and the correct ID is passed
    try {
        await fetch(`${apiBase}/tasks/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({})
        });
        loadTasks();  // Reload tasks to reflect the change
    } catch (error) {
        console.error("Error completing task:", error);
    }
};


// Delete a task
const deleteTask = async (id) => {
    try {
        await fetch(`${apiBase}/tasks/${id}`, { method: "DELETE" });
        loadTasks();
    } catch (error) {
        console.error("Error deleting task:", error);
    }
};

// Initial load
loadCategoriesAndPriorities();
loadTasks();
