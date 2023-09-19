const startHour = 9;
const finishHour = 17;
var today = dayjs();
var mainCon = $('#main');
var alertDiv = $('.alert-stack')


// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
    // TODO: Add a listener for click events on the save button. This code should
    // use the id in the containing time-block as a key to save the user input in
    // local storage. HINT: What does `this` reference in the click listener
    // function? How can DOM traversal be used to get the "hour-x" id of the
    // time-block containing the button that was clicked? How might the id be
    // useful when saving the description in local storage?
    mainCon.on('click', '.saveBtn', handleSaveClick);
    // TODO: Add code to apply the past, present, or future class to each time
    // block by comparing the id to the current hour. HINTS: How can the id
    // attribute of each time-block be used to conditionally add or remove the
    // past, present, and future classes? How can Day.js be used to get the
    // current hour in 24-hour time?
    renderPlanner()
    // TODO: Add code to get any user input that was saved in localStorage and set
    // the values of the corresponding textarea elements. HINT: How can the id
    // attribute of each time-block be used to do this?
    renderSavedPlans()
    // TODO: Add code to display the current date in the header of the page.
    renderToday();
});


function renderToday() {
    $('#currentDay').text(today.format('dddd, MMMM D') + 'th');
}

function renderPlanner() {
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

function handleSaveClick() {
    var hour = $(this).parent().attr('id').split('-')[1];
    var plan = $(this).parent().children().eq(1).val().trim();
    if (plan != '') {
        var alert = $("<div class='alert alert-success alert-dismissible fade show' role='alert'>");
        var alertMsg = $("<strong>Appointment on " + hour +":00" + " has been saved!</strong>");
        alert.append(alertMsg);
        alertDiv.append(alert);
        var closeButt = $("<button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'>")
        closeButt.append("<span aria-hidden='true'>&times;</span>")
        alert.append(closeButt);   
        var savedPlans = JSON.parse(localStorage.getItem("plans"));
        if (savedPlans === null) {
            var newPlans = [{hour, plan}];
            localStorage.setItem("plans", JSON.stringify(newPlans));
        }
        else {
            var changePlan = false;
            savedPlans.forEach(x => {
                if (x.hour === hour) {
                    x.plan = plan;
                    changePlan = true;
                    return;
                }
            })
            localStorage.setItem("plans", JSON.stringify(savedPlans));
            if (!changePlan) {
                var newPlans = savedPlans.concat([{hour, plan}])
                localStorage.setItem("plans", JSON.stringify(newPlans));
            }
        }  
    } else {
        var alert = $("<div class='alert alert-danger alert-dismissible fade show' role='alert'>");
        var alertMsg = $("<strong>Input must not be empty!</strong>");
        alert.append(alertMsg);
        alertDiv.append(alert);
        var closeButt = $("<button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'>")
        closeButt.append("<span aria-hidden='true'>&times;</span>")
        alert.append(closeButt);  
    }
}

function renderSavedPlans() {
    var savedPlans = JSON.parse(localStorage.getItem("plans"));
    if (savedPlans !== null) {
        savedPlans.forEach(item => {
            var hourRow = $('#hour-' + item.hour);
            hourRow.children().eq(1).text(item.plan);
        })
    }
}