var stepped = 0,
  chunks = 0,
  rows = 0;
var start, end;
var parser;
var pauseChecked = false;
var printStepChecked = false;
var matchResults = null;
var pointsLost = 0;
var pointsScoreAndWinner = 3;
var pointsWinnerOnly = 1;
var resultsURL = "https://github.com/anoobbacker/betwc/blob/master/data/results.csv?raw=true&version2.0";
var predictionDataURL = "https://github.com/anoobbacker/betwc/blob/master/data/predict.csv?raw=true&version2.0";
var groupStage1MatchNumber = 1
var groupStage2MatchNumber = 17
var groupStage3MatchNumber = 31
var teamNameAcronymn = {
  'Argentina': 'ARG',
  'Australia': 'AUS',
  'Belgium': 'BEL',
  'Brazil': 'BRA',
  'Colombia': 'COL',
  'Costa Rica': 'CRC',
  'Croatia': 'CRO',
  'Denmark': 'DEN',
  'Egypt': 'EGY',
  'England': 'ENG',
  'France': 'FRA',
  'Germany': 'GER',
  'Iceland': 'ISL',
  'Iran': 'IRN',
  'Japan': 'JPN',
  'South Korea': 'KOR',
  'Mexico': 'MEX',
  'Morocco': 'MAR',
  'Nigeria': 'NGA',
  'Panama': 'PAN',
  'Peru': 'PER',
  'Poland': 'POL',
  'Portugal': 'POR',
  'Russia': 'RUS',
  'Saudi Arabia': 'KSA',
  'Senegal': 'SEN',
  'Serbia': 'SRB',
  'Spain': 'ESP',
  'Sweden': 'SWE',
  'Switzerland': 'SUI',
  'Tunisia': 'TUN',
  'Uruguay': 'URU',
  'Korea Republic': 'KOR'
}

$.fn.exists = function () {
  return this.length !== 0;
}

$(function () {
  $('#features').ready(function () {
    $('#features').css('display', 'none');
  });

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
  var leaderboardPredictScorePlusWinnerGameCount = {};
  var leaderboardPredictWinnerGameCount = {};
  var leaderboardPredictLossesGameCount = {};
  var leaderboardPredictMatchesScorePlusWinner = {};
  var leaderboardPredictMatchesWinner = {};
  var leaderboardPredictMatchesLost = {};

  //all match prediction table
  var tbl = document.createElement('table');
  tbl.setAttribute('class', 'table table-condensed');
  tbl.setAttribute('id', 'breakupdetail');

  var thead = document.createElement('thead');
  var tbdy = document.createElement('tbody');

  //upcoming match prediction table
  var upcomingTbl = document.createElement('table');
  upcomingTbl.setAttribute('class', 'table table-condensed');
  upcomingTbl.setAttribute('id', 'upcomingdetail');
  var upcomingTbdy = document.createElement('tbody');

  var lastMatchNo = 0;
  var newMatch = false;
  var isUpcoming = false;
  for (var i = results.data.length - 1; i >= 0; i--) {
    var row = results.data[i];
    if (i == 0) {
      //table headers      
      var theadrow = document.createElement('tr');

      //add match number
      var theadth = document.createElement('th');
      theadth.textContent = row[0];
      //theadrow.appendChild(theadth);

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
        isUpcoming = false;
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
        //tbdytr.appendChild(tbdytdName);


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
          var winner = "";
          if (matchResultTeamAScore > matchResultTeamBScore) {
            matchResultString = "<b>" + matchResultTeamAName +
              "(" + matchResultTeamAScore + ")</b> " +
              matchResultTeamBName + "(" + matchResultTeamBScore + ")";
          } else if (matchResultTeamAScore < matchResultTeamBScore) {
            matchResultString = matchResultTeamAName + "(" + matchResultTeamAScore + ") <b>" +
              matchResultTeamBName + "(" + matchResultTeamBScore + ")</b>";
          } else {
            matchResultString = matchResultTeamAName + "(" + matchResultTeamAScore + ") " +
              matchResultTeamBName + "(" + matchResultTeamBScore + ")";
          }
          matchComplete = true;
        } else {
          matchResultString = matchResultTeamAName + " vs " +
            matchResultTeamBName + " on " + matchResultStatus;
          var matchDateDiff = Math.abs(Date.parse(matchResultStatus) - new Date());
          var diffDays = Math.ceil(matchDateDiff / (1000 * 3600 * 24));
          console.log("Days to start: " + diffDays);
          if (diffDays <= 1) {
            isUpcoming = true;
          }
        }
        tbdytdName = document.createElement('td');
        tbdytdName.innerHTML = matchResultString;
        tbdytdName.setAttribute('rowspan', '6');
        tbdytr.appendChild(tbdytdName);
      }

      //name
      var participantName = row[3];
      var avatarInline = "<img src='./img/" + participantName + ".png' width='20' />" +
        participantName;
      
      tbdytdName = document.createElement('td');
      tbdytdName.innerHTML = avatarInline;
      tbdytr.appendChild(tbdytdName);

      //predict
      var predictTeamAScore = row[4];
      var predictTeamBScore = row[5];
      var predictTeamAName = teamNameAcronymn[matchResultTeamAName];
      var predictTeamBName = teamNameAcronymn[matchResultTeamBName];

      var predictString = "";
      if (predictTeamAScore > predictTeamBScore) {
        predictString = "<b>" + predictTeamAName + "(" + predictTeamAScore + ")</b> " +
          predictTeamBName + "(" + predictTeamBScore + ")";
      } else if (predictTeamAScore < predictTeamBScore) {
        predictString = predictTeamAName + "(" + predictTeamAScore + ") <b>" +
          predictTeamBName + "(" + predictTeamBScore + ")</b>";
      } else {
        predictString = predictTeamAName + "(" + predictTeamAScore + ") " +
          predictTeamBName + "(" + predictTeamBScore + ")";
      }
      tbdytdName = document.createElement('td');
      tbdytdName.innerHTML = predictString;
      tbdytr.appendChild(tbdytdName);

      //points
      var predictPoints = pointsLost;
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
        if (!(participantName in leaderboard)) {
          leaderboard[participantName] = 0;
          leaderboardPredictScorePlusWinnerGameCount[participantName] = 0;
          leaderboardPredictWinnerGameCount[participantName] = 0;
          leaderboardPredictLossesGameCount[participantName] = 0;
          leaderboardPredictMatchesScorePlusWinner[participantName] = [];
          leaderboardPredictMatchesWinner[participantName] = [];
          leaderboardPredictMatchesLost[participantName] = [];
        }

        leaderboard[participantName] += predictPoints;
        if (predictPoints == pointsScoreAndWinner) {
          leaderboardPredictScorePlusWinnerGameCount[participantName] += 1;
          leaderboardPredictMatchesScorePlusWinner[participantName].push(predictString);
        }

        if (predictPoints >= pointsWinnerOnly) {
          leaderboardPredictWinnerGameCount[participantName] += 1;
          leaderboardPredictMatchesWinner[participantName].push(predictString);
        }

        if (predictPoints == pointsLost) {
          leaderboardPredictLossesGameCount[participantName] += 1;
          leaderboardPredictMatchesLost[participantName].push(predictString);
        }
      } else {
        tbdytdName.textContent = "-";
      }
      tbdytr.appendChild(tbdytdName);

      if (currentMatchNo >= groupStage3MatchNumber) {
        //append the row
        tbdy.appendChild(tbdytr);
      }

      if (isUpcoming) {
        upcomingTbdy.appendChild(tbdytr.cloneNode(true));
      }

      location.hash = "features";
    }
  }

  tbl.appendChild(thead);
  upcomingTbl.appendChild(thead.cloneNode(true));

  tbl.appendChild(tbdy);
  upcomingTbl.appendChild(upcomingTbdy);

  var sortedLeaderboard = Object.keys(leaderboard) //Create a list from the keys of your map. 
    .sort( //Sort it ...
      function (a, b) { // using a custom sort function that...
        // compares (the keys) by their respective values.
        return leaderboard[b] - leaderboard[a];
      })
  console.log("Sorted leaders: " + sortedLeaderboard);

  var leaderBoardTbl1 = createLeaderBoard1(leaderboard,
    leaderboardPredictScorePlusWinnerGameCount,
    leaderboardPredictWinnerGameCount,
    leaderboardPredictLossesGameCount,
    leaderboardPredictMatchesScorePlusWinner,
    leaderboardPredictMatchesWinner,
    leaderboardPredictMatchesLost,
    sortedLeaderboard);

  var leaderBoardTbl2 = createLeaderBoard2(leaderboard,
    leaderboardPredictScorePlusWinnerGameCount,
    leaderboardPredictWinnerGameCount,
    leaderboardPredictLossesGameCount,
    leaderboardPredictMatchesScorePlusWinner,
    leaderboardPredictMatchesWinner,
    leaderboardPredictMatchesLost,
    sortedLeaderboard);
  if ($("#featuredetail").exists()) {
    $("#featuredetail").remove();
  }

  if ($("#upcomingdetail").exists()) {
    $("#upcomingdetail").remove();
  }

  if ($("#breakupdetail").exists()) {
    $("#breakupdetail").remove();
  }

  if ($("#leaderboard").exists()) {
    $("#leaderboard").remove();
  }

  if ($("#leaderboarddetail").exists()) {
    $("#leaderboarddetail").remove();
  }

  $("#featuredetails").append(leaderBoardTbl1);
  $("#upcomingdetails").append(upcomingTbl);
  $("#leaderboarddetails").append(leaderBoardTbl2);
  $("#breakupdetails").append(tbl);
  enableButton();

}

function createLeaderBoard1(leaderboard,
  leaderboardPredictScorePlusWinnerGameCount,
  leaderboardPredictWinnerGameCount,
  leaderboardPredictLossesGameCount,
  leaderboardPredictMatchesScorePlusWinner,
  leaderboardPredictMatchesWinner,
  leaderboardPredictMatchesLost,
  sortedLeaderboard) {
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

    var tpoint1 = document.createElement('td');
    tpoint1.innerHTML = leaderboard[pName] +
      "<div style=\"font-size: 0.8em\">(# of Winning Scores: " +
      leaderboardPredictScorePlusWinnerGameCount[pName] +
      ", # of Winning Games: " +
      leaderboardPredictWinnerGameCount[pName] +
      ", # of Lost Games: " +
      leaderboardPredictLossesGameCount[pName] +
      ")</div>";

    //add leader row
    trow.appendChild(thead1);
    trow.appendChild(thead2);
    trow.appendChild(tpoint1);
    tLbdy.appendChild(trow);
  }

  leaderTbl.appendChild(tLbdy);

  // $("#featuredetails").append(leaderTbl);

  return leaderTbl;
}

function createLeaderBoard2(leaderboard,
  leaderboardPredictScorePlusWinnerGameCount,
  leaderboardPredictWinnerGameCount,
  leaderboardPredictLossesGameCount,
  leaderboardPredictMatchesScorePlusWinner,
  leaderboardPredictMatchesWinner,
  leaderboardPredictMatchesLost,
  sortedLeaderboard) {
  var leaderTbl = document.createElement('table');

  leaderTbl.setAttribute('class', 'table table-condensed');
  leaderTbl.setAttribute('id', 'leaderboarddetail');

  var tLhead = document.createElement('thead');

  var thRow = document.createElement('tr');

  var thHead1 = document.createElement('th');
  thHead1.textContent = "Name";
  thHead1.setAttribute('colspan', '2');

  var thHead3 = document.createElement('th');
  thHead3.textContent = "Winning Scores";

  var thHead4 = document.createElement('th');
  thHead4.textContent = "Winning Matches";

  var thHead5 = document.createElement('th');
  thHead5.textContent = "Lost Matches";

  thRow.appendChild(thHead1);
  thRow.appendChild(thHead3);
  thRow.appendChild(thHead4);
  thRow.appendChild(thHead5);
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

    var tpoint2 = document.createElement('td');
    tpoint2.innerHTML = leaderboardPredictScorePlusWinnerGameCount[pName];
    // tpoint2.innerHTML += "<br/><div style=\"font-size: 0.8em\">" +
    //   leaderboardPredictMatchesScorePlusWinner[pName].sort().join("<br/>") +
    //   "</div>";


    var tpoint3 = document.createElement('td');
    tpoint3.innerHTML = leaderboardPredictWinnerGameCount[pName];
    // tpoint3.innerHTML += "<div style=\"font-size: 0.8em\">" +
    //   leaderboardPredictMatchesWinner[pName].sort().join("<br/>") +
    //   "</div>";

    var tpoint4 = document.createElement('td');
    tpoint4.innerHTML = leaderboardPredictLossesGameCount[pName];
    // tpoint4.innerHTML += "<div style=\"font-size: 0.8em\">" +
    //   leaderboardPredictMatchesLost[pName].sort().join("<br/>") +
    //   "</div>";

    //add leader row
    trow.appendChild(thead1);
    trow.appendChild(thead2);

    trow.appendChild(tpoint2);
    trow.appendChild(tpoint3);
    trow.appendChild(tpoint4);

    tLbdy.appendChild(trow);
  }

  leaderTbl.appendChild(tLbdy);

  // $("#featuredetails").append(leaderTbl);

  return leaderTbl;
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
  $('#features').css('display', 'block');
}