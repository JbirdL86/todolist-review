let tasksList = [];

function init() {
  if (localStorage.getItem('tasks')) {
    tasksList = JSON.parse(localStorage.getItem('tasks'));
  
    displayTasks(tasksList);
    setEventListners();
  } else {
    setStorage(tasksList);
    displayTasks(tasksList);
    setEventListners();
  }
}

class Task {
  constructor(description, completed, index) {
    this.description = description;
    this.completed = completed;
    this.index = index;
  }
}

export const createTask = (task) => {
  const divContainer = document.createElement('div');
  const li = document.createElement('li');
  const checkValue = (task.completed === true) ? 'checked' : '';
  const checkClass = (task.completed === true) ? 'marked' : '';
  divContainer.classList.add('div-container');
  li.classList.add('task-item');

  li.innerHTML = `
        <label class="task-label">
          <input class="checkbox" ${checkValue} type="checkbox">
          <input class="task-description ${checkClass}" type="text" value="${task.description}">
          <input type="hidden" class="" value="${task.index}">
        </label>
        <i class="fas fa-ellipsis-v"></i>
        <i class="far fa-trash-alt"></i>`;

  divContainer.appendChild(li);

  return divContainer;
};

export const displayTasks = (taskList) => {
  const taskUl = document.querySelector('.list-placeholder');

  taskList.forEach((element) => {
    const div = createTask(element);
    taskUl.appendChild(div);
  });
};

export function setEventListners() {
  dragDropListeners();
  editTaskListners();
  taskCompleteListners();
  addNewListner();
  deleteTaskListner();
  deleteAllListner();
}

export function addNewTask() {
  const input = document.querySelector('#input-task');
  const taskUl = document.querySelector('.list-placeholder');
  let taskArr = [];

  if (localStorage.getItem('tasks')) {
    taskArr = JSON.parse(localStorage.getItem('tasks'));
  }

  taskArr.push(new Task(input.value, false, taskArr.length + 1));
  input.value = '';
  taskUl.innerHTML = '';
  displayTasks(taskArr);
  setEventListners();
}

export function deleteTask(event) {
  const taskUl = document.querySelector('.list-placeholder');
  const removeTaskDiv = event.target.parentNode.parentNode;

  taskUl.removeChild(removeTaskDiv);
}

export function clearSelected() {
  const taskUl = document.querySelector('.list-placeholder');
  const removeTask = document.querySelectorAll('.marked');

  removeTask.forEach((element) => {
    const removeTaskDiv = element.parentElement.parentElement.parentElement;
    taskUl.removeChild(removeTaskDiv);
  });
}


function update() {
  const checkBoxItems = document.querySelectorAll('.checkbox');
  const descriptionItems = document.querySelectorAll('.task-description');
  const newObj = [];

  checkBoxItems.forEach((checkBox, index) => {
    newObj.push({
      description: descriptionItems[index].value,
      completed: checkBox.checked,
      index: i + 1,
    });
  });
  setStorage(newObj);
}

export const dragDropListeners = () => {
  const elements = document.querySelectorAll('.task-item');
  const containers = document.querySelectorAll('.div-container');
  const arrElements = Array.from(elements);
  const arrContainer = Array.from(containers);

  let dragItem = null;

  arrElements.forEach((element) => {
    element.setAttribute('draggable', 'true');
    element.addEventListener('dragstart', () => {
      dragItem = element;
    });
    element.addEventListener('dragend', () => {
      dragItem = null;
    });
  });

  arrContainer.forEach((container) => {
    container.addEventListener('dragover', (event) => {
      event.preventDefault();
    });
    container.addEventListener('dragenter', (event) => {
      event.preventDefault();
    });
    container.addEventListener('drop', () => {
      dropSort(dragItem, container.firstElementChild);
      update();
    });
  });
};

export const taskCompleteListners = () => {
  const checkboxes = document.querySelectorAll('.checkbox');
  const checkboxArr = Array.from(checkboxes);

  checkboxArr.forEach((inputBox) => {
    inputBox.addEventListener('change', (event) => {
      checkCompleted(event);
      update();
    });
  });
};

export const addNewListner = () => {
  const input = document.querySelector('#input-task');

  input.addEventListener('keyup', (event) => {
    if (event.key === 'Enter' && input.value !== '' && event.target.matches('#input-task')) {
      addNewTask();
      update();
    }
  });
};

export const editTaskListners = () => {
  const tasksInput = document.querySelectorAll('.task-description');
  const arrInput = Array.from(tasksInput);

  arrInput.forEach((input) => {
    input.addEventListener('input', () => {
      update();
    });
  });
};

export const deleteTaskListner = () => {
  const tasks = document.querySelectorAll('.fa-trash-alt');
  const tasksArr = Array.from(tasks);

  tasksArr.forEach((task) => {
    task.addEventListener('click', (event) => {
      deleteTask(event);
      update();
    });
  });
};

export const deleteAllListner = () => {
  const clearTasks = document.querySelector('#clear-tasks');

  clearTasks.addEventListener('click', () => {
    clearSelected();
    update();
  });
};

export default function dropSort(dragItem, currentItem) {
  const oldItem = currentItem;
  const oldContainer = currentItem.parentNode;
  const newItem = dragItem;
  const newContainer = dragItem.parentNode;
  newContainer.appendChild(oldItem);
  oldContainer.appendChild(newItem);
}

export default function checkCompleted(event) {
  event.target.completed = event.target.checked;
  if (event.target.completed === true) {
    event.currentTarget.nextElementSibling.classList.add('marked');
  } else {
    event.currentTarget.nextElementSibling.classList.remove('marked');
  }
}

function setStorage(taskList) {
  localStorage.setItem('tasks', JSON.stringify(taskList));
}

init();
