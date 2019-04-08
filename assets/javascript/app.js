var config = {
    apiKey: "AIzaSyDvWaZfnSKsb4irEF1KkclBwfCVHTeZ0p4",
    authDomain: "timesheet-6f9a6.firebaseapp.com",
    databaseURL: "https://timesheet-6f9a6.firebaseio.com",
    projectId: "timesheet-6f9a6",
    storageBucket: "timesheet-6f9a6.appspot.com",
    messagingSenderId: "797776768306"
};
firebase.initializeApp(config);

var database = firebase.database();

$("#submit").on("click", function (event) {
    event.preventDefault();

    var trainName = $("#train-name").val().trim();
    var dest = $("#destination").val().trim();
    // var firstTime = moment($("#first-time").val().trim(), "hh:mm").format("X");
    var firstTime = $("#first-time").val().trim();
    var freq = $("#frequency").val().trim();

    var newTrain = {
        train: trainName,
        destination: dest,
        first: firstTime,
        frequency: freq,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    };

    database.ref("train-scheduler").push(newTrain);

    // console.log(newTrain.train);
    // console.log(newTrain.destination);
    // console.log(newTrain.first);
    // console.log(newTrain.frequency);
    // console.log(newTrain.dateAdded);

    alert("Train successfully added");

    $("#train-name").val("");
    $("#destination").val("");
    $("#first-time").val("");
    $("#frequency").val("");

});

database.ref("train-scheduler").on("child_added", function (childSnapshot) {

    console.log(childSnapshot.val());

    var trainName = childSnapshot.val().train;
    var dest = childSnapshot.val().destination;
    var firstTime = childSnapshot.val().first;
    var freq = childSnapshot.val().frequency;

    console.log("Train Name: " + trainName);
    console.log("Destination: " + dest);
    console.log("First Train of the day: " + firstTime);
    console.log("Departs every: " + freq + " minutes");

    // var firstTimeConverted = moment(childSnapshot.val().firstTime, "hh:mm").subtract(1, "years");
    var firstTimeConverted = moment(firstTime, "hh:mm a").subtract(1, "years");
    console.log(firstTimeConverted.format("hh:mm a"));
    var currentTime = moment();
    console.log("Current Time: " + moment(currentTime).format("hh:mm a"));
    // console.log(moment(firstTimeConverted).format("hh:mm"));
    var timeDiff = currentTime.diff(moment(firstTimeConverted), "minutes");
    console.log(timeDiff);
    // var timeRemain = timeDiff % childSnapshot.val().frequency;
    var timeRemain = timeDiff % freq;
    // var minAway = childSnapshot.val().frequency - timeRemain;
    var minAway = freq - timeRemain;
    console.log(minAway);
    var nextArrival = moment().add(minAway, "minutes");
    console.log(moment(nextArrival).format("hh:mm a"));

    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(dest),
        $("<td>").text(freq),
        $("<td>").text(nextArrival.format("hh:mm a")),
        $("<td>").text(minAway),
    );

    $("#train-table > tbody").append(newRow);

});

function infoUpdate() {
    $("#train-table > tbody").empty();
    database.ref("train-scheduler").on("child_added", function (childSnapshot) {

        console.log(childSnapshot.val());

        var trainName = childSnapshot.val().train;
        var dest = childSnapshot.val().destination;
        var firstTime = childSnapshot.val().first;
        var freq = childSnapshot.val().frequency;

        console.log("Train Name: " + trainName);
        console.log("Destination: " + dest);
        console.log("First Train of the day: " + firstTime);
        console.log("Departs every: " + freq + " minutes");

        // var firstTimeConverted = moment(childSnapshot.val().firstTime, "hh:mm").subtract(1, "years");
        var firstTimeConverted = moment(firstTime, "hh:mm a").subtract(1, "years");
        console.log(firstTimeConverted.format("hh:mm a"));
        var currentTime = moment();
        console.log("Current Time: " + moment(currentTime).format("hh:mm a"));
        // console.log(moment(firstTimeConverted).format("hh:mm"));
        var timeDiff = currentTime.diff(moment(firstTimeConverted), "minutes");
        console.log(timeDiff);
        // var timeRemain = timeDiff % childSnapshot.val().frequency;
        var timeRemain = timeDiff % freq;
        // var minAway = childSnapshot.val().frequency - timeRemain;
        var minAway = freq - timeRemain;
        console.log(minAway);
        var nextArrival = moment().add(minAway, "minutes");
        console.log(moment(nextArrival).format("hh:mm a"));

        var newRow = $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(dest),
            $("<td>").text(freq),
            $("<td>").text(nextArrival.format("hh:mm a")),
            $("<td>").text(minAway),
        );

        $("#train-table > tbody").append(newRow);

    });

}
setInterval(infoUpdate, 10000);