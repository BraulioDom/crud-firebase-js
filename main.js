const taskForm = document.getElementById('task-form')
const taskContainer = document.getElementById('tasks-container')

let editStatus = false;
let taskId = ''

const saveTask = (title, description) => {
    db.collection('tasks').doc().set({
        title, description
    })
}

const updateTask = (id, updateTask) => {
    db.collection('tasks').doc(id).update(updateTask)
}

const getTask = (id) => {
    return db.collection('tasks').doc(id).get()
}

const getTasks = () => {
    return db.collection('tasks').get()
}

const onGetTasks = (callback) => {
    return db.collection('tasks').onSnapshot(callback)
}

const handleDelete = async (id) => {
    await db.collection('tasks').doc(id).delete()
}

const handleUpdate = async (id) => {
    const doc = await getTask(id)
    // console.log(task.data());
    const task = doc.data()
    taskForm['task-title'].value = task.title
    taskForm['task-description'].value = task.description
    editStatus = true
    taskId = doc.id
}

window.addEventListener('DOMContentLoaded', async(e) => {
    onGetTasks((querySnapshot) => {
        taskContainer.innerHTML = ''
        querySnapshot.forEach(doc => {
            // console.log(doc.data());
            const task = doc.data()
            taskContainer.innerHTML += `
            <div class="card card-body mt-2">
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <div>
                <button class="btn btn-success" onclick="handleUpdate('${doc.id}')">Update</button>
                <button class="btn btn-danger" onclick="handleDelete('${doc.id}')">Delete</button>
            </div>
            </div>
            `
        });
    })
})

taskForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const title = taskForm['task-title'].value
    const description = taskForm['task-description'].value

    if(!editStatus){
        await saveTask(title, description)
    } else{
        await updateTask(taskId, {title, description})
        editStatus = false
    }
    
    taskForm.reset()
})