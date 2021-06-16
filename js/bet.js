var stepped = 0,
  chunks = 0,
  rows = 0;
var start, end;
var parser;
var pauseChecked = false;
var printStepChecked = false;
var matchResults = null;
const random = Math.random();
var resultsURL = "https://betwc.blob.core.windows.net/betwec/results-eurocup2020.csv?ver=" + random;
var predictionDataURL = "https://betwc.blob.core.windows.net/betwec/predict-eurocup2020.csv?ver="+ random;

var matchStages = [
  //stage1
  {
    MatchNumber: 1,
    StageStartDate: 'June 11, 2021',
    StageEndDate: 'June 23, 2021',
    Stage: 0,
    ScoreAndWinnerPoints: 3,
    WinnerOnlyPoints: 1,
    LostPoints: 0
  },
  //stage2
  {
    MatchNumber: 37,
    StageStartDate: 'June 26, 2021',
    StageEndDate: 'June 29, 2021',
    Stage: 1,
    ScoreAndWinnerPoints: 3,
    WinnerOnlyPoints: 1,
    LostPoints: 0
  },
  //stage3
  {
    MatchNumber: 44,
    StageStartDate: 'July 2, 2021',
    StageEndDate: 'July 3, 2021',
    Stage: 2,
    ScoreAndWinnerPoints: 5,
    WinnerOnlyPoints: 3,
    LostPoints: -1
  },
  //stage4
  {
    MatchNumber: 48,
    StageStartDate: 'July 6, 2021',
    StageEndDate: 'July 7, 2021',
    Stage: 3,
    ScoreAndWinnerPoints: 15,
    WinnerOnlyPoints: 5,
    LostPoints: -5
  },
  //finals
  {
    MatchNumber: 50,
    StageStartDate: 'July 11, 2021',
    StageEndDate: 'July 11, 2021',
    Stage: 4,
    ScoreAndWinnerPoints: 40,
    WinnerOnlyPoints: 15,
    LostPoints: -10
  }
];

var teamNameAcronymn = {
  'Argentina': 'ARG',
  'Australia': 'AUS',
  'Austria': 'AUT',
  'Belgium': 'BEL',
  'Brazil': 'BRA',  
  'Colombia': 'COL',
  'Costa Rica': 'CRC',
  'Croatia': 'CRO',
  'Czech Republic': 'CZE',
  'Denmark': 'DEN',
  'Egypt': 'EGY',
  'England': 'ENG',
  'France': 'FRA',
  'Finland': 'FIN',
  'Germany': 'GER',
  'Hungary': 'HUN',
  'Iceland': 'ISL',
  'Iran': 'IRN',
  'Italy': 'ITA',
  'Japan': 'JPN',  
  'Korea Republic': 'KOR',
  'South Korea': 'KOR',
  'Mexico': 'MEX',
  'Morocco': 'MAR',
  'Nigeria': 'NGA',
  'Netherlands': 'NED',
  'North Macedonia': 'MKD',
  'Panama': 'PAN',
  'Peru': 'PER',
  'Poland': 'POL',
  'Portugal': 'POR',
  'Russia': 'RUS',
  'Saudi Arabia': 'KSA',
  'Scotland': 'SCO',
  'Senegal': 'SEN',
  'Serbia': 'SRB',
  'Spain': 'ESP',
  'Sweden': 'SWE',
  'Slovakia': 'SVK',
  'Switzerland': 'SUI',
  'Tunisia': 'TUN',
  'Turkey': 'TUR',
  'Uruguay': 'URU',
  'Ukraine': 'UKR',
  'Wales': 'WAL',
}
var leaderboardCatalog = [];
var keyOptions = [
  "Participant", //0
  "Total points", //1
  "Total score predict matches", //2
  "Total winner predict matches", //3
  "Total predict lost matches", //4
  "Groupstage matchday1 points", //5
  "Groupstage matchday1 score predict matches", //6
  "Groupstage matchday1 winner predict matches", //7
  "Groupstage matchday1 predict lost matches", //8
  "Groupstage matchday2 points", //9
  "Groupstage matchday2 score predict matches", //10
  "Groupstage matchday2 winner predict matches", //11
  "Groupstage matchday2 predict lost matches", //12
  "Groupstage matchday3 points", //13
  "Groupstage matchday3 score predict matches", //14
  "Groupstage matchday3 winner predict matches", //15
  "Groupstage matchday3 predict lost matches", //16
  "Round16 points", //17
  "Round16 score predict matches", //18
  "Round16 winner predict matches", //19
  "Round16 predict lost matches", //20
  "Quarter final points", //21
  "Quarter final score predict matches", //22
  "Quarter final winner predict matches", //23
  "Quarter final predict lost matches", //24
  "Semi final points", //25
  "Semi final score predict matches", //26
  "Semi final winner predict matches", //27
  "Semi final predict lost matches", //28
  "Final points", //29
  "Total number of matches" //30
];

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

//function that is called after parsing prediction csv file.
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

  //find the active stage rounds of the matches
  var activeStageMatchNumber = 1;
  for (var i = 0; i < matchStages.length; i++) {
    var dDiff = Date.parse(matchStages[i].StageEndDate) - new Date()
    var diffDays = Math.ceil(dDiff / (1000 * 3600 * 24));
    if (diffDays >= 0) {
      activeStageMatchNumber = matchStages[i].MatchNumber;
      break;
    }
  }

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
      theadth.textContent = "Match";
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

      var currentMatchStage = matchStages.length - 1;
      for (var x = 0; x < matchStages.length; x++) {
        if (currentMatchNo < matchStages[x].MatchNumber) {
          currentMatchStage = matchStages[x].Stage - 1;
          break;
        }
      }

      //name
      var participantName = row[3].trim();
      if (!"".localeCompare(participantName)) {
        continue;
      }

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
          var matchDateDiff = Math.abs(Date.parse(matchResultStatus.trim()) - new Date());
          var diffDays = Math.ceil(matchDateDiff / (1000 * 3600 * 24));
          if (diffDays <= 1) {
            isUpcoming = true;
          }
        }
        tbdytdName = document.createElement('td');
        tbdytdName.innerHTML = matchResultString;
        tbdytdName.setAttribute('rowspan', '6');
        tbdytr.appendChild(tbdytdName);
      }

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
      if ((0 == predictTeamAScore.length) && (0 == predictTeamBScore.length)) {
        //skipped prediction
        predictString = "( Yet to submit ) ";
      } else if ((-1 == predictTeamAScore) && (-1 == predictTeamBScore)) {
        //skipped prediction
        predictString = "( Skipped ) ";
      } else if (predictTeamAScore > predictTeamBScore) {
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
      var predictPoints = matchStages[currentMatchStage].LostPoints;
      if ((-1 == predictTeamAScore) && (-1 == predictTeamBScore)) {
        //skipped prediction
      } else if ((matchResultTeamAScore == predictTeamAScore) &&
        (matchResultTeamBScore == predictTeamBScore)) {
        //Perfect prediction
        predictPoints = matchStages[currentMatchStage].ScoreAndWinnerPoints;
      } else if ((matchResultTeamAScore == matchResultTeamBScore) &&
        (predictTeamAScore == predictTeamBScore)) {
        //Only predicted the winner but score wasn't correct.
        predictPoints = matchStages[currentMatchStage].WinnerOnlyPoints;
      } else if ((matchResultTeamAScore > matchResultTeamBScore) &&
        (predictTeamAScore > predictTeamBScore)) {
        //Only predicted the winner but score wasn't correct.
        predictPoints = matchStages[currentMatchStage].WinnerOnlyPoints;
      } else if ((matchResultTeamAScore < matchResultTeamBScore) &&
        (predictTeamAScore < predictTeamBScore)) {
        //Only predicted the winner but score wasn't correct.
        predictPoints = matchStages[currentMatchStage].WinnerOnlyPoints;
      }

      tbdytdName = document.createElement('td');
      if (matchComplete) {
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

        if (predictPoints >= matchStages[currentMatchStage].WinnerOnlyPoints) {
          leaderboardPredictWinnerGameCount[participantName] += 1;
          leaderboardPredictMatchesWinner[participantName].push(predictString);
          tbdytdName.innerHTML = '<i class="fas fa-angle-up" style="color:#32CD32;"></i>' + Math.abs(predictPoints);
        }

        if (predictPoints == matchStages[currentMatchStage].ScoreAndWinnerPoints) {
          leaderboardPredictScorePlusWinnerGameCount[participantName] += 1;
          leaderboardPredictMatchesScorePlusWinner[participantName].push(predictString);
          tbdytdName.innerHTML = '<i class="fas fa-angle-double-up" style="color:#32CD32;"></i>' + Math.abs(predictPoints);
        }

        if (predictPoints == matchStages[currentMatchStage].LostPoints) {
          leaderboardPredictLossesGameCount[participantName] += 1;
          leaderboardPredictMatchesLost[participantName].push(predictString);
          tbdytdName.innerHTML = '<i class="fas fa-angle-down" style="color:#DC143C;"></i>' + Math.abs(predictPoints);
        }

        updateLeaderBoardCatalog(currentMatchNo, participantName, predictPoints, currentMatchStage);
      } else {
        //tbdytdName.textContent = "-";
        tbdytdName.innerHTML = '<i class="fas fa-ellipsis-h" style="color:#797D7F;"></i>';
      }

      if (isUpcoming) {
        upcomingTbdy.appendChild(tbdytr.cloneNode(true));
      }

      tbdytr.appendChild(tbdytdName);

      //append the row if match is in active stage
      if (currentMatchNo >= activeStageMatchNumber) {
        tbdy.appendChild(tbdytr);
      }

      location.hash = "features";
    }
  }

  tbl.appendChild(thead);
  if (tbdy.childElementCount == 0) {
    var tbdytr = document.createElement('tr');
    var tbdytdName = document.createElement('td');
    tbdytdName.textContent = "Predictions are pending. Wait for particpants to submit the predictions.";
    tbdytdName.setAttribute('colspan', thead.children[0].children.length);
    tbdytr.appendChild(tbdytdName);
    tbl.appendChild(tbdytr);
  }
  tbl.appendChild(tbdy);

  var upcomingTblHead = thead.cloneNode(true);
  upcomingTblHead.firstElementChild.removeChild(upcomingTblHead.firstElementChild.lastElementChild);
  
  if (upcomingTbdy.childElementCount == 0) {
    var tbdytr = document.createElement('tr');
    var tbdytdName = document.createElement('td');
    tbdytdName.textContent = "Predictions are pending. Wait for particpants to submit the predictions.";
    tbdytdName.setAttribute('colspan', thead.children[0].children.length);
    tbdytr.appendChild(tbdytdName);
    upcomingTbdy.appendChild(tbdytr);
  }
  upcomingTbl.appendChild(upcomingTblHead);
  upcomingTbl.appendChild(upcomingTbdy);

  var sortedLeaderboard = Object.keys(leaderboard) //Create a list from the keys of your map. 
    .sort( //Sort it ...
      function (a, b) { // using a custom sort function that...
        // compares (the keys) by their respective values.
        return leaderboard[b] - leaderboard[a];
      })
  // console.log("Sorted leaders: " + sortedLeaderboard);

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

  $("#featuredetails").append(createLeaderBoard1(leaderboard,
    leaderboardPredictScorePlusWinnerGameCount,
    leaderboardPredictWinnerGameCount,
    leaderboardPredictLossesGameCount,
    leaderboardPredictMatchesScorePlusWinner,
    leaderboardPredictMatchesWinner,
    leaderboardPredictMatchesLost,
    sortedLeaderboard));
  $("#upcomingdetails").append(upcomingTbl);
  $("#leaderboarddetails").append(createLeaderBoard2(leaderboard,
    leaderboardPredictScorePlusWinnerGameCount,
    leaderboardPredictWinnerGameCount,
    leaderboardPredictLossesGameCount,
    leaderboardPredictMatchesScorePlusWinner,
    leaderboardPredictMatchesWinner,
    leaderboardPredictMatchesLost,
    sortedLeaderboard));
  $("#breakupdetails").append(tbl);
  $("#chart").html('');

  //loadChart(leaderboardCatalog);

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
      "<div style=\"font-size: 0.8em\">(Predicted Score Matches: " +
      leaderboardPredictScorePlusWinnerGameCount[pName] +
      ", Predicted Win Matches: " +
      leaderboardPredictWinnerGameCount[pName] +
      ", Predicted Fail Matches: " +
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

function checkAndInitialize(pName) {
  var pFound = false;
  //find participantName in the array
  for (var i = 0; i < leaderboardCatalog.length; i++) {
    var leaderBoardItem = leaderboardCatalog[i];
    if (leaderBoardItem[keyOptions[0]] == pName) {
      pFound = true;
      break;
    }
  }

  if (pFound == false) {
    var pKeyName = keyOptions[0];
    var leaderBoardItem = {};
    leaderBoardItem[pKeyName] = pName;
    for (var k = 1; k < keyOptions.length; k++) {
      leaderBoardItem[keyOptions[k]] = 0;
    }
    leaderboardCatalog.push(leaderBoardItem);
  }
}

function updateLeaderBoardCatalog(currentMatchNo, participantName, predictPoints, currentMatchStage) {

  checkAndInitialize(participantName);

  //find participantName in the array
  for (var i = 0; i < leaderboardCatalog.length; i++) {
    if (leaderboardCatalog[i][keyOptions[0]] == participantName) {
      var leaderBoardItem = leaderboardCatalog[i];
      leaderBoardItem[keyOptions[1]] += predictPoints;
      leaderBoardItem[keyOptions[30]] += 1;
      if (predictPoints == matchStages[currentMatchStage].ScoreAndWinnerPoints) {
        leaderBoardItem[keyOptions[2]] += 1;
      }

      if (predictPoints >= matchStages[currentMatchStage].WinnerOnlyPoints) {
        leaderBoardItem[keyOptions[3]] += 1;
      }

      if (predictPoints == matchStages[currentMatchStage].LostPoints) {
        leaderBoardItem[keyOptions[4]] += 1;
      }
      if (currentMatchNo < matchStages[1].MatchNumber) {
        leaderBoardItem[keyOptions[5]] += predictPoints;
        if (predictPoints == matchStages[currentMatchStage].ScoreAndWinnerPoints) {
          leaderBoardItem[keyOptions[6]] += 1;
        }

        if (predictPoints >= matchStages[currentMatchStage].WinnerOnlyPoints) {
          leaderBoardItem[keyOptions[7]] += 1;
        }

        if (predictPoints == matchStages[currentMatchStage].LostPoints) {
          leaderBoardItem[keyOptions[8]] += 1;
        }
      } else if (currentMatchNo < matchStages[2].MatchNumber) {
        leaderBoardItem[keyOptions[9]] += predictPoints;
        if (predictPoints == matchStages[currentMatchStage].ScoreAndWinnerPoints) {
          leaderBoardItem[keyOptions[10]] += 1;
        }

        if (predictPoints >= matchStages[currentMatchStage].WinnerOnlyPoints) {
          leaderBoardItem[keyOptions[11]] += 1;
        }

        if (predictPoints == matchStages[currentMatchStage].LostPoints) {
          leaderBoardItem[keyOptions[12]] += 1;
        }
      } else if (currentMatchNo < matchStages[3].MatchNumber) {
        leaderBoardItem[keyOptions[13]] += predictPoints;
        if (predictPoints == matchStages[currentMatchStage].ScoreAndWinnerPoints) {
          leaderBoardItem[keyOptions[14]] += 1;
        }

        if (predictPoints >= matchStages[currentMatchStage].WinnerOnlyPoints) {
          leaderBoardItem[keyOptions[15]] += 1;
        }

        if (predictPoints == matchStages[currentMatchStage].LostPoints) {
          leaderBoardItem[keyOptions[16]] += 1;
        }
      } else if (currentMatchNo < matchStages[4].MatchNumber) {
        leaderBoardItem[keyOptions[17]] += predictPoints;
        if (predictPoints == matchStages[currentMatchStage].ScoreAndWinnerPoints) {
          leaderBoardItem[keyOptions[18]] += 1;
        }

        if (predictPoints >= matchStages[currentMatchStage].WinnerOnlyPoints) {
          leaderBoardItem[keyOptions[19]] += 1;
        }

        if (predictPoints == matchStages[currentMatchStage].LostPoints) {
          leaderBoardItem[keyOptions[20]] += 1;
        }
      } else if (currentMatchNo < matchStages[5].MatchNumber) {
        leaderBoardItem[keyOptions[21]] += predictPoints;
        if (predictPoints == matchStages[currentMatchStage].ScoreAndWinnerPoints) {
          leaderBoardItem[keyOptions[22]] += 1;
        }

        if (predictPoints >= matchStages[currentMatchStage].WinnerOnlyPoints) {
          leaderBoardItem[keyOptions[23]] += 1;
        }

        if (predictPoints == matchStages[currentMatchStage].LostPoints) {
          leaderBoardItem[keyOptions[24]] += 1;
        }
      } else if (currentMatchNo < matchStages[6].MatchNumber) {
        leaderBoardItem[keyOptions[25]] += predictPoints;
        if (predictPoints == matchStages[currentMatchStage].ScoreAndWinnerPoints) {
          leaderBoardItem[keyOptions[26]] += 1;
        }

        if (predictPoints >= matchStages[currentMatchStage].WinnerOnlyPoints) {
          leaderBoardItem[keyOptions[27]] += 1;
        }

        if (predictPoints == matchStages[currentMatchStage].LostPoints) {
          leaderBoardItem[keyOptions[28]] += 1;
        }
      } else if (currentMatchNo < matchStages[6].MatchNumber + 2) {
        leaderBoardItem[keyOptions[29]] += predictPoints;
      }
    }
  }
}

//function that is called after parsing prediction csv file and starts 
//trigger parsing prediction csv file
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

//start parsing prediction csv file
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

//read the results csv file
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