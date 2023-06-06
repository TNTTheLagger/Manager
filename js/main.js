function addTask(){
    var name = document.getElementById("name").value;
    var details = document.getElementById("details").value;
    var isCompleted = 0;
    var date = document.getElementById("date").value;
    var time = document.getElementById("time").value;

    date = date + "T" + time;

    fetch("/api/addTask", {
      method: "POST",
      body: JSON.stringify({
        name: name,
        details: details,
        isCompleted: isCompleted,
        date: date
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
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
    for (var i = 0; i < tasks.length; i++){
        var template = document.getElementById("INP").cloneNode(true);
        console.log(tasks[i].inProgress);
        if(tasks[i].isCompleted !== 1){
            template.classList.add("CELL");
            template.id = tasks[i].id;
            template.childNodes[1].innerHTML = tasks[i].name;
            template.childNodes[3].innerHTML = tasks[i].details;
            INPT.appendChild(template);
        }

    }
}

async function getCalendarPlan(){
  var tasks = await getTasks();
  tasks.sort(function(a, b){
    var dateA=new Date(a.date), dateB=new Date(b.date)
    return dateA-dateB
  })
  for (var i = 0; i < tasks.length; i++){
    //tasks[i].date = tasks[i].date.split("T")[0];
    console.log(tasks[i].date);
    var tdate=new Date(tasks[i].date)
    var calendar_events = document.getElementById("calendar_eve").childNodes[3].cloneNode(true);
    if(tdate > new Date()){
      console.log(calendar_events.childNodes);
      if(tasks[i].inProgress === 1){
        calendar_events.classList.add("event_item_active");
        console.log(calendar_events.childNodes);
        calendar_events.childNodes[1].innerHTML = tdate.getDate() + "/" + (tdate.getMonth()+1) + "/" + tdate.getFullYear() + " " + tdate.getHours() + ":" + tdate.getMinutes() + ":" + tdate.getSeconds() + " - " + tasks[i].details;
        calendar_events.childNodes[3].innerHTML = tasks[i].name;  
        document.getElementById("calendar_eve").appendChild(calendar_events);
      }else{
        console.log(calendar_events.childNodes);
        calendar_events.childNodes[1].innerHTML = tasks[i].name;
        calendar_events.childNodes[3].innerHTML = tdate.getDate() + "/" + (tdate.getMonth()+1) + "/" + tdate.getFullYear() + " " + tdate.getHours() + ":" + tdate.getMinutes() + ":" + tdate.getSeconds() + " - " + tasks[i].details;
        document.getElementById("calendar_eve").appendChild(calendar_events);
      }
    }
  }
  document.getElementById("calendar_eve").childNodes[3].remove(); 
}