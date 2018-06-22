var stepped = 0,
  chunks = 0,
  rows = 0;
var start, end;
var parser;
var pauseChecked = false;
var printStepChecked = false;
var matchResults = null;
var pointsScoreAndWinner = 3;
var pointsWinnerOnly = 1;
var resultsURL="https://anoobbacker.github.io/data/results01.csv";
var predictionDataURL="https://anoobbacker.github.io/data/predict01.csv";

$.fn.exists = function () {
  return this.length !== 0;
}

$(function () {
  $('#submit').click(function () {
    stepped = 0;
    chunks = 0;
    rows = 0;
    matchResults = null;

    disableButton();
    var rConfig = buildResultsConfig();
    Papa.parse(
      resultsURL,
      rConfig);
    if (rConfig.worker || rConfig.download)
      console.log("Results parsing running...");
  });
});

function completePredictFn(results) {
  if (results && results.errors) {
    if (results.errors) {
      errorCount = results.errors.length;
      firstError = results.errors[0];
    }
    if (results.data && results.data.length > 0)
      rowCount = results.data.length;
  }

  //printStats("Parse complete");
  console.log("    Predict Results:", results);
  if (!matchResults) {
    console.log("    Match Results not loaded!");
    return;
  }

  var leaderboard = {};
  var tbl = document.createElement('table');
  tbl.setAttribute('class', 'table table-condensed');
  tbl.setAttribute('id', 'breakupdetails');

  var thead = document.createElement('thead');
  var tbdy = document.createElement('tbody');

  var lastMatchNo = 0;
  var newMatch = false;
  for (var i = 0; i < results.data.length; i++) {
    var row = results.data[i];
    if (i == 0) {
      //table headers      
      var theadrow = document.createElement('tr');

      //add match number
      var theadth = document.createElement('th');
      theadth.textContent = row[0];
      theadrow.appendChild(theadth);

      //add name
      theadth = document.createElement('th');
      theadth.textContent = "Actual results";
      theadrow.appendChild(theadth);

      //add name
      theadth = document.createElement('th');
      theadth.textContent = row[3];
      theadrow.appendChild(theadth);

      //add prediction
      theadth = document.createElement('th');
      theadth.textContent = "Predict";
      theadrow.appendChild(theadth);

      //add prediction
      theadth = document.createElement('th');
      theadth.textContent = "Points";
      theadrow.appendChild(theadth);


      //set header row in the table
      thead.appendChild(theadrow);
    } else {
      if (row.length != 6) {
        continue;
      }
      currentMatchNo = row[0];
      if (lastMatchNo != currentMatchNo) {
        newMatch = true;
      } else {
        newMatch = false;
      }
      lastMatchNo = currentMatchNo;

      //table rows
      var tbdytr = document.createElement('tr');

      //add match#
      var tbdytdName = null;
      if (newMatch) {
        tbdytdName = document.createElement('td');
        tbdytdName.textContent = currentMatchNo;
        tbdytdName.setAttribute('rowspan', '6');
        tbdytr.appendChild(tbdytdName);


        //actual result
        var matchResultString = "";
        var matchResult = matchResults[currentMatchNo];

        var matchResultTeamAName = matchResult[1];
        var matchResultTeamBName = matchResult[2];
        var matchResultTeamAScore = matchResult[4];
        var matchResultTeamBScore = matchResult[5];
        var matchResultStatus = matchResult[3];
        var matchComplete = false;
        if (!"Complete".localeCompare(matchResultStatus)) {
          matchResultString = matchResultTeamAName + "(" + matchResultTeamAScore + ") " +
            matchResultTeamBName + "(" + matchResultTeamBScore + ")";
          matchComplete = true;
        } else {
          matchResultString = matchResultTeamAName + " vs " +
            matchResultTeamBName + " on " + matchResultStatus;
        }
        tbdytdName = document.createElement('td');
        tbdytdName.textContent = matchResultString;
        tbdytdName.setAttribute('rowspan', '6');
        tbdytr.appendChild(tbdytdName);
      }

      //name
      var participantName = row[3];
      tbdytdName = document.createElement('td');
      tbdytdName.textContent = participantName;
      tbdytr.appendChild(tbdytdName);

      //predict
      var predictTeamAScore = row[4];
      var predictTeamBScore = row[5];
      var predictString = matchResultTeamAName + "(" + predictTeamAScore + ") " +
        matchResultTeamBName + "(" + predictTeamBScore + ")";
      tbdytdName = document.createElement('td');
      tbdytdName.textContent = predictString;
      tbdytr.appendChild(tbdytdName);

      //points
      var predictPoints = 0;
      if ((matchResultTeamAScore == predictTeamAScore) &&
        (matchResultTeamBScore == predictTeamBScore)) {
        predictPoints = pointsScoreAndWinner;
      } else if ((matchResultTeamAScore == matchResultTeamBScore) &&
        (predictTeamAScore == predictTeamBScore)) {
        predictPoints = pointsWinnerOnly;
      } else if ((matchResultTeamAScore > matchResultTeamBScore) &&
        (predictTeamAScore > predictTeamBScore)) {
        predictPoints = pointsWinnerOnly;
      } else if ((matchResultTeamAScore < matchResultTeamBScore) &&
        (predictTeamAScore < predictTeamBScore)) {
        predictPoints = pointsWinnerOnly;
      }

      tbdytdName = document.createElement('td');
      if (matchComplete) {
        tbdytdName.textContent = predictPoints;
        if (participantName in leaderboard) {
          leaderboard[participantName] += predictPoints;
        } else {
          leaderboard[participantName] = predictPoints;
        }
      } else {
        tbdytdName.textContent = "-";
      }
      tbdytr.appendChild(tbdytdName);

      //append the row
      tbdy.appendChild(tbdytr);

      location.hash = "features";
    }
  }

  tbl.appendChild(thead);
  tbl.appendChild(tbdy);

  var sortedLeaderboard = Object.keys(leaderboard) //Create a list from the keys of your map. 
    .sort( //Sort it ...
      function (a, b) { // using a custom sort function that...
        // compares (the keys) by their respective values.
        return leaderboard[b] - leaderboard[a];
      })
  console.log("Sorted leaders: " + sortedLeaderboard);

  var leaderBoard = createLeaderBoard1(leaderboard, sortedLeaderboard);

  if ($("#featuredetail").exists()) {
    $("#featuredetail").remove();
  }

  if ($("#breakupdetails").exists()) {
    $("#breakupdetails").remove();
  }

  if ($("#leaderboard").exists()) {
    $("#leaderboard").remove();
  }

  $("#featuredetails").append(leaderBoard);
  $("#featuredetails").append(tbl);
  enableButton();
}

function createLeaderBoard1(leaderboard, sortedLeaderboard) {
  var leaderTbl = document.createElement('table');

  leaderTbl.setAttribute('class', 'table table-condensed');
  leaderTbl.setAttribute('id', 'leaderboard');

  var tLhead = document.createElement('thead');

  var thRow = document.createElement('tr');

  var thHead1 = document.createElement('th');
  thHead1.textContent = "Name";
  thHead1.setAttribute('colspan', '2');

  var thHead2 = document.createElement('th');
  thHead2.textContent = "Total Points";

  thRow.appendChild(thHead1);
  thRow.appendChild(thHead2);
  tLhead.appendChild(thRow);
  leaderTbl.appendChild(tLhead);

  var tLbdy = document.createElement('tbody');
  //loop through header row elements
  for (var j = 0; j < sortedLeaderboard.length; j++) {
    var pName = sortedLeaderboard[j];

    var trow = document.createElement('tr');

    //add match number
    var thead1 = document.createElement('th');
    var avatar = document.createElement("img");
    avatar.src = "./img/" + pName + ".png";
    avatar.width = "50";

    //add avatar
    thead1.appendChild(avatar);

    var thead2 = document.createElement('th');
    thead2.textContent = pName;
    thead2.style.textAlign = "left";

    var tpoint = document.createElement('td');
    tpoint.textContent = leaderboard[pName];

    //add leader row
    trow.appendChild(thead1);
    trow.appendChild(thead2);
    trow.appendChild(tpoint);

    tLbdy.appendChild(trow);
  }

  leaderTbl.appendChild(tLbdy);

  // $("#featuredetails").append(leaderTbl);

  return leaderTbl;
}

function createLeaderBoard2(leaderboard, sortedLeaderboard) {
  var elem1 = document.createElement('div');
  elem1.setAttribute('class', 'col-lg-16 my-auto');
  elem1.setAttribute('id', 'featuredetail');

  var elem2 = document.createElement('div');
  elem2.setAttribute('class', 'container-fluid');

  var elem3 = document.createElement('div');
  elem3.setAttribute('class', 'row');

  //loop through header row elements
  for (var j = 0; j < sortedLeaderboard.length; j++) {
    var pName = sortedLeaderboard[j];
    elem2.appendChild(createFeatureItem(pName, leaderboard[pName]));
  }

  //elem2.appendChild(elem3);
  elem1.appendChild(elem2);

  //$("#featuredetails").append(elem1);

  return elem1;
}

function createFeatureItem(title, desc) {
  var elem4 = document.createElement('div');
  elem4.setAttribute('class', 'col-lg-6');

  var elem5 = document.createElement('div');
  elem5.setAttribute('class', 'feature-item');

  var elem6 = document.createElement('img');
  elem6.src = "./img/" + title + ".png";
  elem6.width = "50";

  var elem7 = document.createElement('h3');
  elem7.textContent = title;

  var elem8 = document.createElement('p');
  elem8.setAttribute('class', 'text-muted');
  elem8.textContent = desc;

  elem5.appendChild(elem6);
  elem5.appendChild(elem7);
  elem5.appendChild(elem8);

  elem4.appendChild(elem5);

  return elem4;
}

function completeResultsFn(results) {
  if (results && results.errors) {
    if (results.errors) {
      errorCount = results.errors.length;
      firstError = results.errors[0];
    }
    if (results.data && results.data.length > 0) {
      rowCount = results.data.length;
      matchResults = results.data;
    }
  }

  //printStats("Parse complete");
  console.log("    Match Results:", results);

  var pConfig = buildPredictConfig();
  Papa.parse(
    predictionDataURL,
    pConfig);
  if (pConfig.worker || pConfig.download)
    console.log("Prediction parsing running...");
}

function errorFn(err, file) {
  console.log("ERROR:", err, file);
}

function buildPredictConfig() {
  return {
    delimiter: $('#delimiter').val(),
    newline: getLineEnding(),
    header: $('#header').prop('checked'),
    dynamicTyping: $('#dynamicTyping').prop('checked'),
    preview: parseInt($('#preview').val() || 0),
    step: $('#stream').prop('checked') ? stepFn : undefined,
    encoding: $('#encoding').val(),
    worker: $('#worker').prop('checked'),
    comments: $('#comments').val(),
    complete: completePredictFn,
    error: errorFn,
    download: true,
    fastMode: $('#fastmode').prop('checked'),
    skipEmptyLines: $('#skipEmptyLines').prop('checked'),
    chunk: $('#chunk').prop('checked') ? chunkFn : undefined,
    beforeFirstChunk: undefined,
  };
}

function buildResultsConfig() {
  return {
    delimiter: $('#delimiter').val(),
    newline: getLineEnding(),
    header: $('#header').prop('checked'),
    dynamicTyping: $('#dynamicTyping').prop('checked'),
    preview: parseInt($('#preview').val() || 0),
    step: $('#stream').prop('checked') ? stepFn : undefined,
    encoding: $('#encoding').val(),
    worker: $('#worker').prop('checked'),
    comments: $('#comments').val(),
    complete: completeResultsFn,
    error: errorFn,
    download: true,
    fastMode: $('#fastmode').prop('checked'),
    skipEmptyLines: $('#skipEmptyLines').prop('checked'),
    chunk: $('#chunk').prop('checked') ? chunkFn : undefined,
    beforeFirstChunk: undefined,
  };
}

function getLineEnding() {
  if ($('#newline-n').is(':checked'))
    return "\n";
  else if ($('#newline-r').is(':checked'))
    return "\r";
  else if ($('#newline-rn').is(':checked'))
    return "\r\n";
  else
    return "";
}

function enableButton() {
  $('#submit').prop('disabled', false);
  $('#submit').prop('text', "Generate");
}

function disableButton() {
  $('#submit').prop('disabled', true);
  $('#submit').prop('text', "Wait processing predictions...");
}


function printStats(msg) {
  if (msg)
    console.log(msg);
  console.log("  Row count:", rowCount);
  if (stepped)
    console.log("    Stepped:", stepped);
  console.log("     Errors:", errorCount);
  if (errorCount)
    console.log("First error:", firstError);
}