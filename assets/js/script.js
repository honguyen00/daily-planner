const startHour = 9;
const finishHour = 17;
var today = dayjs();
var mainCon = $('#main');
var alertDiv = $('.alert-stack')

$(function () {

    mainCon.on('click', '.saveBtn', handleSaveClick);
    
    renderPlanner()
    
    renderSavedPlans()
    
    renderToday();
});

//Display the current date in the header of the page.
function renderToday() {
    // in this format: Thursday, September 21th
    $('#currentDay').text(today.format('dddd, MMMM D') + 'th');
}

//Displaying the row of the planner with corresponding colors
function renderPlanner() {
    //loop through each hour and add classes correspondingly
    for (var i=startHour; i<=finishHour;i++) {
        var rowDiv = $("<div class='row time-block'>")
        rowDiv.attr('id', 'hour-' + i);
        if(i < parseInt(today.format('H'))) {
            rowDiv.addClass('past')
        } else if(i > parseInt(today.format('H'))) {
            rowDiv.addClass('future')
        } else {
            rowDiv.addClass('present')
        }
        var hourDiv = $("<div class='col-2 col-md-1 hour text-center py-3'>");
        if (i > 12) {
            hourDiv.text((i-12) + 'PM')
        }
        else {
            hourDiv.text(i + 'AM');
        }
        var textarea = $("<textarea class='col-8 col-md-10 description' rows='3'>")
        var savebutt = $("<button class='btn saveBtn col-2 col-md-1' aria-label='save'>")
        savebutt.append($("<i class='fas fa-save' aria-hidden='true'></i>"));
        rowDiv.append(hourDiv, textarea, savebutt);
        mainCon.append(rowDiv);
    }
}

//Handle save button clicked
function handleSaveClick() {
    // get users' input values
    var hour = $(this).parent().attr('id').split('-')[1];
    var plan = $(this).parent().children().eq(1).val().trim();
    // boolean value for changing the plan
    var changePlan = false; 
        //get saved plan from local storage 
        var savedPlans = JSON.parse(localStorage.getItem("plans"));
        // no saved plans, create a new plan array
        if (!savedPlans) {
            if (plan != "") {
                var newPlans = [{hour, plan}];
                localStorage.setItem("plans", JSON.stringify(newPlans));
                renderNotification("update", hour);
            }
            else {
                renderNotification();
            }
        }
        // there is saved plans, loop through each plan to decide whether users want to change plan or add a new plan
        else {
            savedPlans.forEach(x => {
                if (x.hour === hour) {
                    x.plan = plan;
                    changePlan = true;
                    return;
                }
            });
            // add a new plan to existing plan array
            if (!changePlan) {
                if (plan != "") {
                    var newPlans = savedPlans.concat([{hour, plan}])
                    localStorage.setItem("plans", JSON.stringify(newPlans));
                    renderNotification("update", hour);
                }
                else {
                    renderNotification();
                }
            } 
            // update plan from existing plan array 
            else {
                if (plan != "") {
                    localStorage.setItem("plans", JSON.stringify(savedPlans));
                    renderNotification("update", hour);
                }
                else {
                    var newPlans = savedPlans.filter(item => item.plan != "");
                    localStorage.setItem("plans", JSON.stringify(newPlans));
                    renderNotification("delete", hour);
                }
            }
        }  
} 

//Displaying any plans that have been saved to the planner
function renderSavedPlans() {
    var savedPlans = JSON.parse(localStorage.getItem("plans"));
    if (savedPlans !== null) {
        savedPlans.forEach(item => {
            var hourRow = $('#hour-' + item.hour);
            hourRow.children().eq(1).text(item.plan);
        })
    }
}

//Displaying the notification on the screen
function renderNotification(str, hour) {
    var alert = $("<div class='alert fade show' role='alert'>");
    if (str === 'update') {
        var alertMsg = $("<strong>Appointment on " + hour +":00" + " has been saved!</strong>");
        alert.addClass('alert-success');
    } else if (str === 'delete') {
        var alertMsg = $("<strong>Appointment on " + hour +":00" + " has been delete!</strong>");
        alert.addClass('alert-warning');
    }
    else {
        var alertMsg = $("<strong>Plan cannot be empty!</strong>");
        alert.addClass('alert-danger');
    }
    alert.append(alertMsg);
    alertDiv.append(alert);
    setTimeout(() => {
        $('.alert').alert('close');
    }, 1500)
}