function addTask(){
    var name = document.getElementById("name").value;
    var details = document.getElementById("details").value;
    var isCompleted = document.getElementById("isCompleted").value;
    var date = document.getElementById("date").value;
    
    const body = {
        name: name,
        details: details,
        isCompleted: isCompleted,
        date: date
      };
      $.post("/api/addTask", body, (data, status) => {
        if (data == null){
            alert("An error occured while adding the task!");
        }
        else{
            alert("Task added successfully!");
        }
      });
}

async function getTasks(){
    return new Promise((resolve, reject) => {
        $.get("/api/getTasks", (data, status) => {
          if (data == null) {
            alert("An error occurred while getting tasks!");
            reject("Error: An error occurred while getting tasks");
          } else {
            resolve(data);
          }
        });
    });
}

async function getTasksIndex(){
    var tasks = await getTasks();
    var INPT = document.getElementById("INPT");
    var DONT = document.getElementById("DONT");
    for (var i = 0; i < tasks.length; i++){
        var template = document.getElementById("INP").cloneNode(true);
        console.log(tasks[i].isCompleted);
        if(tasks[i].isCompleted === 1){
            template.classList.add("CELL");
            template.id = tasks[i].id;
            template.childNodes[1].innerHTML = tasks[i].name;
            template.childNodes[3].innerHTML = tasks[i].details;
            DONT.appendChild(template);
        }else{
            template.classList.add("CELL");
            template.id = tasks[i].id;
            template.childNodes[1].innerHTML = tasks[i].name;
            template.childNodes[3].innerHTML = tasks[i].details;
            INPT.appendChild(template);
        }

    }
}