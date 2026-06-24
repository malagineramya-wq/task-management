const API = "http://localhost:5000/api";

async function register(){

const name =
document.getElementById("regName").value;

const email =
document.getElementById("regEmail").value;

const password =
document.getElementById("regPassword").value;

const res = await fetch(
`${API}/auth/register`,
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
name,
email,
password
})
}
);

const data = await res.json();

alert(data.message);
}

async function login(){

const email =
document.getElementById("loginEmail").value;

const password =
document.getElementById("loginPassword").value;

const res = await fetch(
`${API}/auth/login`,
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
email,
password
})
}
);

const data = await res.json();

if(data.token){

localStorage.setItem(
"token",
data.token
);

window.location =
"dashboard.html";
}
else{
alert(data.message);
}
}

function logout(){

localStorage.removeItem("token");

window.location="index.html";
}

async function createTask(){

const title =
document.getElementById("title").value;

const description =
document.getElementById("description").value;

const status =
document.getElementById("status").value;

await fetch(`${API}/tasks`,{

method:"POST",

headers:{
"Content-Type":"application/json",
Authorization:
`Bearer ${localStorage.getItem("token")}`
},

body:JSON.stringify({
title,
description,
status
})
});

loadTasks();
}

async function loadTasks(){

const res =
await fetch(`${API}/tasks`,{

headers:{
Authorization:
`Bearer ${localStorage.getItem("token")}`
}
});

const tasks =
await res.json();

const taskList =
document.getElementById("taskList");

if(!taskList) return;

taskList.innerHTML="";

let completed=0;
let pending=0;

tasks.forEach(task=>{

if(task.status==="Completed")
completed++;

if(task.status==="Pending")
pending++;

taskList.innerHTML += `

<div class="task-card">

<div class="task-info">

<h3>${task.title}</h3>

<p>${task.description}</p>

<p>Status: ${task.status}</p>

</div>

<div class="task-actions">

<button
class="edit-btn"
onclick="editTask('${task._id}')">
Edit
</button>

<button
class="delete-btn"
onclick="deleteTask('${task._id}')">
Delete
</button>

</div>

</div>
`;
});

document.getElementById(
"totalTasks"
).innerText=tasks.length;

document.getElementById(
"completedTasks"
).innerText=completed;

document.getElementById(
"pendingTasks"
).innerText=pending;
}

async function deleteTask(id){

await fetch(
`${API}/tasks/${id}`,
{
method:"DELETE",
headers:{
Authorization:
`Bearer ${localStorage.getItem("token")}`
}
}
);

loadTasks();
}

async function editTask(id){

const title =
prompt("Enter new title");

if(!title) return;

await fetch(
`${API}/tasks/${id}`,
{
method:"PUT",

headers:{
"Content-Type":"application/json",
Authorization:
`Bearer ${localStorage.getItem("token")}`
},

body:JSON.stringify({
title
})
}
);

loadTasks();
}

if(window.location.pathname.includes(
"dashboard.html"
)){
loadTasks();

const socket =
io("http://localhost:5000");

socket.on(
"taskUpdated",
()=>{
loadTasks();
}
);
}