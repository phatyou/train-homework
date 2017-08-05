// Initialize Firebase
var config = {
     apiKey: "AIzaSyAhgp8SIeMpj_KcyXKP2FLrRpU9xkNgKEg",
     authDomain: "create-new-project-56ec8.firebaseapp.com",
     databaseURL: "https://create-new-project-56ec8.firebaseio.com",
     projectId: "create-new-project-56ec8",
     storageBucket: "create-new-project-56ec8.appspot.com",
     messagingSenderId: "605934161906"
     };
  
firebase.initializeApp(config);

var database = firebase.database();

var trainName;
var destination;
var firstTime;
var frequency;

//Submit the values entered in the form with class "train-input"
$("#train-input").submit(function(event) {
  event.preventDefault();
  trainName = $("#train-name").val().trim();
  destination  = $("#destination").val().trim();
  firstTime = $("#first-train-time").val().trim();
  frequency = $("#frequency").val().trim();
  
  // console.log(firstTime);

  database.ref().push({
    trainName: trainName,
    destination: destination,
    firstTime: firstTime,
    frequency: frequency
  });
});

// console.log(firstTime);

database.ref().on('child_added', function (childSnapshot) {

     // Assumptions
     var tFrequency = childSnapshot.val().frequency;
     console.log("tFrequency");

     var tFirstTime = childSnapshot.val().firstTime;
     console.log("tFirstTime");

     //First Time (pushed bacck 1 year to make sure it comes before the current time)
     var firstTimeConverted = moment(childSnapshot.val().firstTime, "hh:mm").subtract(1, "years");
     console.log(firstTimeConverted);

     var currentTime = moment();
     console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm A"));

     var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
     console.log("DIFFERENCE IN TIME: " +  diffTime, "hh:mm");

     // var currentTime = moment();
     // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

     var tRemainder = diffTime % tFrequency;
     console.log(tRemainder);

     // Minutes Until Train
     var tMinutesTillTrain = tFrequency - tRemainder;
     console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
     
     // Next Train
     var nextTrain = moment().add(tMinutesTillTrain, "minutes");
     console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm A"));

     var nextTrainTime = moment(nextTrain).format("hh:mm A");

  $('.train-schedule').append('<tr id=""><td class=\'col-xs-2\'>' +
  childSnapshot.val().trainName  +'</td>'+
  '<td class=\'col-xs-2\'>'+childSnapshot.val().destination+'</td>'+
  '<td class=\'col-xs-2\'>'+childSnapshot.val().frequency+'</td>'+
  '<td class=\'col-xs-2\'>'+ nextTrainTime + '</td>' +
  '<td class=\'col-xs-2\'>'+tMinutesTillTrain+ '</td></tr>');
  },

  function (errorObject){
    console.log('Error handling: ' + errorObject.code);
  });