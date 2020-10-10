let tasks = [];
let subtask = [];

onload = () => {

    const MyTasks = JSON.parse(localStorage.getItem('Atarefado-Tasks'));
    if (MyTasks)
        tasks = MyTasks;

    showTasks();
    document.querySelector('#inputNewTask').oninput = watchField;
    document.querySelector('#btnAdd').onclick = () => {
        document.querySelector('#btnAddNewTask').disabled = true;
        showPage('AddPage');
        removeSubtaskDivs();
        document.querySelector('#pageTitle').innerHTML = 'Nova Tarefa';
        document.querySelector('#inputNewTask').focus();
    };
    document.querySelector('#TaskToggle').onclick = () => {
        var select = document.getElementById('TaskToggle').checked
        showSubtasks(select);
    };
    document.querySelector('#EditTaskToggle').onclick = () => {
        var select = document.getElementById('EditTaskToggle').checked
        showEditSubtasks(select);
    };
    document.querySelector('#btnCancelNewTask').onclick = () => {
        document.querySelector('#inputNewTask').value = '';
        document.querySelector('#pageTitle').innerHTML = 'Minhas Tarefas';
        removeSubtaskDivs();
        showTasks();
        showPage('initialPage')
    };
    document.querySelector('#btnAddNewTask').onclick = () => {
        addNewTask();
    };
    document.querySelector('#btnNewSubtask').onclick = () => {
        newSubtask();
    };
    document.querySelector('#btnNewSubtaskEdit').onclick = () => {
        newSubtaskEdit();
    };
    document.querySelector('#btnEditTask').onclick = () => {
        editTask();
        removeSubtaskDivs();
    };
    document.querySelector('#btnRemoveTask').onclick = () => {
        deleteTask();
        removeSubtaskDivs();
    };
};

const removeSubtaskDivs = () => {
    var toRemove = document.querySelectorAll('[id^="subtaskDiv"]');
    toRemove.forEach(element => {
        element.remove();
    });
    var toogle = document.getElementById('TaskToggle');
    toogle.checked = false;
    var finish = document.getElementById('inputTaskDate');
    finish.value = null;

    var removeButton = document.getElementById('btnNewSubtask');
    removeButton.classList.add('hidden');
};

const showTasks = () => {
    const tasksList = document.querySelector('#taskList');
    var today = ajustDate();
    tasksList.innerHTML = '';
    tasks.forEach((t) => {
        let elemTask = document.createElement('li');
        elemTask.innerHTML = t.description;
        elemTask.setAttribute('data-id', t.id)


        if (t.Subtasks.length > 0) {
            let icon = document.createElement('span');
            icon.innerHTML = "keyboard_arrow_down";
            icon.classList.add("material-icons");
            icon.classList.add("icon-end");

            elemTask.append(icon);
        }


        let btn = document.createElement('a');
        btn.innerHTML = "edit";
        btn.classList.add("material-icons");
        btn.classList.add("button-end");
        btn.style = "color: black"

        btn.onclick = (e) => {
            var selectedItem = e.target.parentElement.getAttribute('data-id');
            editingTask(selectedItem);
        }

        elemTask.append(btn);

        let subList = document.createElement('ul');
        if (t.Subtasks.length > 0) {
            t.Subtasks.forEach(element => {
                let subElem = document.createElement('li');
                subElem.innerHTML = element.description;
                subElem.setAttribute('data-id', element.id);

                let subcheck = document.createElement('input');
                subcheck.type = "Checkbox";
                subcheck.checked = element.IsDone;
                subcheck.classList.add('mr1');
                subcheck.classList.add('ml1');
                subcheck.classList.add('check');
                if (element.IsDone)
                    subElem.classList.add('done');


                subcheck.onclick = (e) => {
                    var selectedId = e.target.parentElement.getAttribute('data-id');
                    var status = e.target.checked;
                    e.target.parentElement.classList.toggle("done");
                    updateSubtask(selectedId, status);
                };
                if (t.endDate < today) {
                    subElem.classList.add('late');
                }
                subElem.prepend(subcheck);
                subList.append(subElem);
            });
        }
        subList.classList.add('showSub');
        elemTask.append(subList);

        if (t.Subtasks.length > 0)
            elemTask.onclick = (e) => {
                var child = e.target.querySelector('ul');
                child.classList.toggle('open');
            }
        let elemCheck = document.createElement('input');
        elemCheck.type = "Checkbox";
        elemCheck.checked = t.IsDone;
        elemCheck.classList.add('mr1');
        elemCheck.classList.add('check');
        if (t.IsDone)
            elemTask.classList.add('done');

        elemCheck.onclick = (e) => {
            var selectedId = e.target.parentElement.getAttribute('data-id');
            console.log(e.target);

            var status = e.target.checked;
            e.target.parentElement.classList.toggle("done");
            updateTask(selectedId, status);
            showTasks();
        };
        if (t.endDate < today) {
            elemTask.classList.add('late');
        }

        elemTask.prepend(elemCheck);

        tasksList.appendChild(elemTask);
    });

    if (tasks.length > 0) {
        tasksList.classList.remove('hidden');
        document.querySelector('#blank').classList.add('hidden');
    }
    if (tasks.length == 0) {
        tasksList.classList.add('hidden');
        document.querySelector('#blank').classList.remove('hidden');
    }
};

const ajustDate = () => {

    var now = new Date();
    var day = now.getDate().toString().length == 1 ? "0" + now.getDate() : now.getDate();
    var month = now.getMonth() + 1;
    var year = now.getFullYear();
    let date = year + '-' + month + '-' + day;
    return date;
}

const showSubtasks = (status) => {
    var addButton = document.getElementById('btnNewSubtask');
    if (status)
        addButton.classList.remove('hidden');
    else
        addButton.classList.add('hidden');
}
const showEditSubtasks = (status) => {
    var addButton = document.getElementById('btnNewSubtaskEdit');
    if (status)
        addButton.classList.remove('hidden');
    else
        addButton.classList.add('hidden');
}

const showPage = (comp) => {
    let pageList = document.querySelectorAll('body > .component');
    pageList.forEach((c) => c.classList.add('hidden'));
    document.querySelector('#' + comp).classList.remove('hidden');
    if (comp == 'EditPage') {
        document.querySelector('#pageTitle').innerHTML = 'Editar Tarefa';
    }
    if (comp == 'AddPage' || comp == 'EditPage') {
        document.querySelector('#btnAdd').classList.add('hidden');
        document.querySelector('#btnCancelNewTask').classList.remove('hidden');
    } else {
        document.querySelector('#btnAdd').classList.remove('hidden');
        document.querySelector('#btnCancelNewTask').classList.add('hidden');
        document.querySelector('#pageTitle').innerHTML = 'Minhas Tarefas';
    }
};
const editingTask = (id) => {
    removeSubtaskDivs();

    // inputEditTask
    let input = document.getElementById('inputEditTask');
    input.setAttribute('data-id', id);
    let date = document.getElementById('inputEditDate');
    let task = tasks.find((t) => t.id == id);
    let subs = document.getElementById('EditTaskToggle');
    subs.checked = task.Subtasks.length > 0;

    if (task.Subtasks.length > 0) {
        editSubtaks(task);
        let addbutton = document.getElementById('btnNewSubtaskEdit');
        addbutton.classList.remove('hidden')
    }

    input.value = task.description;
    date.value = task.endDate;
    showPage('EditPage');
}

const editSubtaks = (task) => {
    let afterThis = document.getElementById('AnytaskEdit');
    task.Subtasks.forEach(subtask => {
        var div = document.createElement("div");
        div.classList.add("field");
        div.classList.add("mt1");
        div.id = "subtaskDiv" + subtask.id;

        let input = document.createElement('input');
        input.type = 'Text'
        input.setAttribute('data-id', subtask.id);
        input.value = subtask.description;

        let span = document.createElement('a');
        span.classList.add('material-icons');
        span.classList.add("icon");
        span.classList.add("end");
        span.style = "color:red;";
        span.innerHTML = "cancel";

        span.onclick = () => {
            removeSubtask(task.id, subtask.id)
        };

        div.append(input);
        div.append(span);

        afterThis.after(div);
    });
}
const removeSubtask = (parentId, id) => {
    tasks.forEach(element => {
        if (element.id == parentId) {
            element.Subtasks = element.Subtasks.filter((t) => t.id != id);
            console.log(element.Subtasks);
        }
    });
    saveTasks();
    removeSubtaskDivs();
    editSubtaks(tasks.find((t) => t.id == parentId));
}

const addNewTask = () => {
    let field = document.querySelector('#inputNewTask');
    let description = field.value;
    let finish = document.querySelector('#inputTaskDate');
    if (description != '') {

        let mainId = Math.random().toString().replace('0.', '');
        includeSubtask(mainId, 'create');
        tasks.push({
            id: mainId,
            description: description,
            Subtasks: subtask,
            endDate: finish.value,
            IsDone: false,
            parent: null
        });
        field.value = '';
        showPage('initialPage');
        saveTasks();
        subtask = [];
        showTasks();
        document.querySelector('#pageTitle').innerHTML = 'Minhas Tarefas';
    }
};

const updateTask = (selectedId, status) => {
    tasks.forEach(element => {
        if (element.id == selectedId)
            element.IsDone = status;
        if (element.Subtasks.length > 0)
            element.Subtasks.forEach(item => {
                item.IsDone = status;
            })
    });
    saveTasks();
}

const newSubtask = () => {

    var exists = document.querySelectorAll('[id^="subTask"]');
    var div = document.createElement("div");
    div.classList.add("field");
    div.classList.add("mt1");
    div.id = "subtaskDiv" + exists.length;

    var input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Subtarefa";
    input.value = "";
    input.id = "subTask" + exists.length;
    input.autocomplete = "off";

    div.appendChild(input);

    if (exists.length == 0)
        document.getElementById('Anytask').after(div);
    if (exists.length > 0) {
        var baseId = 'subtaskDiv';
        var after = exists.length - 1;
        console.log(after);
        document.getElementById(baseId.concat(after)).after(div);
    }

}
const newSubtaskEdit = () => {

    var exists = document.querySelectorAll('[id^="subTask"]');
    var div = document.createElement("div");
    div.classList.add("field");
    div.classList.add("mt1");
    div.id = "subtaskDiv" + exists.length;

    var input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Subtarefa";
    input.value = "";
    input.id = "subTask" + exists.length;
    input.autocomplete = "off";

    div.appendChild(input);

    if (exists.length == 0)
        document.getElementById('AnytaskEdit').after(div);
    if (exists.length > 0) {
        var baseId = 'subtaskDiv';
        var after = exists.length - 1;
        console.log(after);
        document.getElementById(baseId.concat(after)).after(div);
    }

}
const includeSubtask = (id, from) => {
    if (from == 'create') {
        let mySubtasks = document.querySelectorAll('[id^="subTask"]');
        console.log(mySubtasks);
        if (mySubtasks.length > 0) {
            mySubtasks.forEach(element => {

                if (element.value != '')
                    subtask.push({
                        id: Math.random().toString().replace('0.', ''),
                        description: element.value,
                        IsDone: false,
                        parent: id
                    });

            });
        }
    } else if (from == 'edit') {
        let mySubtasks = document.querySelectorAll('[id^="subtask"]');
        if (mySubtasks.length > 0)
            subtask = [];
        mySubtasks.forEach(element => {
            if (element.firstChild.value != '')
                subtask.push({
                    id: Math.random().toString().replace('0.', ''),
                    description: element.firstChild.value,
                    IsDone: false,
                    parent: id
                });
        });
    }
}

const updateSubtask = (selectedId, status) => {
    tasks.forEach(element => {
        if (element.Subtasks.length > 0)
            element.Subtasks.forEach(item => {
                if (item.id == selectedId) {
                    item.IsDone = status;
                }
            })
    });
    saveTasks();
}

const watchField = (e) => {
    let button = document.querySelector('#btnAddNewTask');
    if (e.target.value.length > 0) button.disabled = false;
    else button.disabled = true;
};

const editTask = () => {
    let field = document.querySelector('#inputEditTask');
    let taskId = field.getAttribute('data-id');
    let i = tasks.findIndex((t) => t.id == taskId);
    let date = document.querySelector('#inputEditDate')
    tasks[i].description = field.value;
    tasks[i].endDate = date.value;
    includeSubtask(taskId, 'edit');
    tasks[i].Subtasks = subtask;

    field.removeAttribute('data-id');
    field.value = '';
    showPage('initialPage');
    saveTasks();
    showTasks();

};

const deleteTask = () => {
    let field = document.querySelector('#inputEditTask');
    let taskId = field.getAttribute('data-id');
    tasks = tasks.filter((t) => t.id != taskId);
    field.removeAttribute('data-id');
    field.value = '';
    showPage('initialPage');
    saveTasks();
    showTasks();
};

const saveTasks = () => {
    localStorage.setItem('Atarefado-Tasks', JSON.stringify(tasks));
};
navigator.serviceWorker.register('./sw.js');