var stepped = 0,
  chunks = 0,
  rows = 0;
var start, end;
var parser;
var pauseChecked = false;
var printStepChecked = false;
var matchResults = null;
const random = Math.random();

var resultsURL = null;
var predictionDataURL = null;
var matchStages = null;
var tournamentName = null;

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
  'TBD': 'TBD',
}

var teamFlag = {
  'Argentina': 'ar',
  'Australia': 'au',
  'Austria': 'at',
  'Belgium': 'be',
  'Brazil': 'br',
  'Colombia': 'co',
  'Costa Rica': 'cr',
  'Croatia': 'hr',
  'Czech Republic': 'cz',
  'Denmark': 'dk',
  'Egypt': 'eg',
  'England': 'gb',
  'France': 'fr',
  'Finland': 'fi',
  'Germany': 'de',
  'Hungary': 'hu',
  'Iceland': 'is',
  'Iran': 'ir',
  'Italy': 'it',
  'Japan': 'jp',
  'Korea Republic': 'kp',
  'South Korea': 'kr',
  'Mexico': 'mx',
  'Morocco': 'ma',
  'Nigeria': 'ng',
  'Netherlands': 'nl',
  'North Macedonia': 'mk',
  'Panama': 'pa',
  'Peru': 'pe',
  'Poland': 'pl',
  'Portugal': 'pt',
  'Russia': 'ru',
  'Saudi Arabia': 'sa',
  'Scotland': 'gb-sct',
  'Senegal': 'sn',
  'Serbia': 'rs',
  'Spain': 'es',
  'Sweden': 'se',
  'Slovakia': 'sk',
  'Switzerland': 'ch',
  'Tunisia': 'tn',
  'Turkey': 'tr',
  'Uruguay': 'uy',
  'Ukraine': 'ua',
  'Wales': 'gb-wls',
}
var leaderboardCatalog = [];
var keyOptions = [];

$.fn.exists = function () {
  return this.length !== 0;
}

$(function () {
  $('#features').ready(function () {
    $('#features').css('display', 'none');
  });

  $('.dropdown-menu a').click(function (event) {
    tournamentName = $(event.target).text();
    resultsURL = null;
    predictionDataURL = null;
    matchStages = null;
    if (!"World Cup 2018".localeCompare(tournamentName)) {
      resultsURL = wc2018ResultsURL;
      predictionDataURL = wc2018PredictionDataURL;
      matchStages = wc2018MatchStages;
    }
    if (!"Euro Cup 2020".localeCompare(tournamentName)) {
      resultsURL = euro2020ResultsURL;
      predictionDataURL = euro2020PredictionDataURL;
      matchStages = euro2020MatchStages;
    }
    
    matchStages.forEach(initializeKeyPoint);

    function initializeKeyPoint(value, index, array) {
      if (keyOptions.length == 0) {
        keyOptions.push("Participant"); //0
        keyOptions.push("Total points"); //1
        keyOptions.push("Total score predict matches"); //2
        keyOptions.push("Total winner predict matches"); //3
        keyOptions.push("Total predict lost matches"); //4
        keyOptions.push("Total number of matches"); //5
      }

      //add these to every stages in the matchStages
      keyOptions.push(value['Desc'] + " points");
      keyOptions.push(value['Desc'] + " score predict matches");
      keyOptions.push(value['Desc'] + " winner predict matches");
      keyOptions.push(value['Desc'] + " predict lost matches");    
    }
    
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
  var predictParticipationTrack = {};

  //all match prediction table
  var tbl = document.createElement('table');
  tbl.setAttribute('class', 'table table-condensed');
  tbl.setAttribute('id', 'breakupdetail');

  //create the table user prediction display
  var thead = document.createElement('thead');
  var tbdy = document.createElement('tbody');
  //table headers      
  var theadrow = document.createElement('tr');

  //add match number
  var theadth = document.createElement('th');
  theadth.textContent = "Match#";
  //theadrow.appendChild(theadth);

  //add match
  theadth = document.createElement('th');
  theadth.textContent = "Match";
  theadrow.appendChild(theadth);

  //add name
  theadth = document.createElement('th');
  theadth.textContent = "Name";
  theadrow.appendChild(theadth);

  //add prediction
  theadth = document.createElement('th');
  theadth.textContent = "Predict";
  theadrow.appendChild(theadth);

  //add points
  theadth = document.createElement('th');
  theadth.textContent = "Points";
  theadrow.appendChild(theadth);

  //set header row in the table
  thead.appendChild(theadrow);

  //find the active stage rounds of the matches
  var activeStageMatchNumber = 0;
  var tournamentStillOn = false;
  var today = new Date();
  for (var i = 0; i < matchStages.length; i++) {
    var dDiff = Date.parse(matchStages[i].StageEndDate) - today;
    var diffDays = Math.ceil(dDiff / (1000 * 3600 * 24));
    if (diffDays >= 0) {
      activeStageMatchNumber = matchStages[i].MatchNumber;
      break;
    }
  }

  var upcomingTbl = null;

  if ($("#upcomingdetail-header").exists()) {
    $("#upcomingdetail-header").remove();
  }

  //set flag to indicate if tournament is still running.
  if (activeStageMatchNumber != 0) {
    tournamentStillOn = true;

    //upcoming match prediction table
    upcomingTbl = document.createElement('table');
    upcomingTbl.setAttribute('class', 'table table-condensed');
    upcomingTbl.setAttribute('id', 'upcomingdetail');

    var upcomingTbdy = document.createElement('tbody');

    var upcomingTblHead = thead.cloneNode(true);
    upcomingTblHead.firstElementChild.removeChild(upcomingTblHead.firstElementChild.lastElementChild);

    var upcomingDiv1 = document.createElement('div');
    upcomingDiv1.setAttribute('class', 'section-heading text-center');
    upcomingDiv1.setAttribute('id', 'upcomingdetail-header');

    var upcomingDiv1H2 = document.createElement('h2');
    upcomingDiv1H2.innerHTML = 'Upcoming match predictions';
    upcomingDiv1.append(upcomingDiv1H2);

    var upcomingDiv1Desc = document.createElement('p');
    upcomingDiv1Desc.setAttribute('class', 'text-muted');
    upcomingDiv1Desc.innerHTML = 'Shows only the predictions for upcomings games. To see all the predictions scroll down to the bottom of the page.';
    upcomingDiv1.append(upcomingDiv1Desc);
  }

  var lastMatchNo = 0;
  var newMatch = false;
  var isUpcoming = false;
  var predictParticipantCount = 0;
  //Check if prediction has (1) Game #, (2) TeamA, 
  //(3) TeamB, (4) Name, (5) TeamAScore, (6) TeamBScore
  var predictionRowColumnCount = 6;

  //By default people participation is 6 folks.
  var predictParticipantCount = 6;
  for (var ii = results.data.length - 1; ii >= 0; ii--) {
    var otherRow = results.data[ii];

    //Check if prediction row has correct column count.
    if (otherRow.length != predictionRowColumnCount) {
      continue;
    }

    var currentMatchNo = otherRow[0];
    if (isNaN(predictParticipationTrack[currentMatchNo])) {
      predictParticipationTrack[currentMatchNo] = 1;
    } else {
      predictParticipationTrack[currentMatchNo]++;
    }
  }

  for (var i = results.data.length - 1; i > 0; i--) {
    var row = results.data[i];

    //Check if prediction row has correct column count.
    if (row.length != predictionRowColumnCount) {
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
      tbdytdName.setAttribute('rowspan', predictParticipationTrack[currentMatchNo]);

      //actual result
      var matchResultString = "";
      var matchResult = matchResults[currentMatchNo];

      var matchResultTeamAName = matchResult[1];
      var matchResultTeamBName = matchResult[2];

      var predictTeamAName = teamNameAcronymn[matchResultTeamAName];
      var predictTeamBName = teamNameAcronymn[matchResultTeamBName];

      var predictTeamAFlag = "";
      var predictTeamBFlag = "";
      if ("TBD".localeCompare(matchResultTeamAName)) {
        predictTeamAFlag = "<img src='img/country-flags-main/" + teamFlag[matchResultTeamAName] + ".svg' height=16px /> ";
      }

      if ("TBD".localeCompare(matchResultTeamBName)) {
        predictTeamBFlag = "<img src='img/country-flags-main/" + teamFlag[matchResultTeamBName] + ".svg' height=16px /> ";
      }

      var matchResultTeamAScore = matchResult[4];
      var matchResultTeamBScore = matchResult[5];
      var matchResultStatus = matchResult[3];
      var matchComplete = false;
      if (!"Complete".localeCompare(matchResultStatus)) {
        var winner = "";
        if (matchResultTeamAScore > matchResultTeamBScore) {
          matchResultString = "<b>"
            + predictTeamAFlag + matchResultTeamAName + "(" +
            matchResultTeamAScore + ")</b><br/> " +
            predictTeamBFlag + matchResultTeamBName + "(" + matchResultTeamBScore + ")";
        } else if (matchResultTeamAScore < matchResultTeamBScore) {
          matchResultString = predictTeamAFlag + matchResultTeamAName + "(" + matchResultTeamAScore + ") <b><br/>" +
            predictTeamBFlag + matchResultTeamBName + "(" + matchResultTeamBScore + ")</b>";
        } else {
          matchResultString = predictTeamAFlag + matchResultTeamAName + "(" + matchResultTeamAScore + ")<br/> " +
            predictTeamBFlag + matchResultTeamBName + "(" + matchResultTeamBScore + ")";
        }
        matchComplete = true;
        if (!"True".localeCompare(matchStages[currentMatchStage].IsFinal)) {
          tournamentStillOn = false;
        }
      } else {
        matchResultString = predictTeamAFlag + matchResultTeamAName + "<br/> " +
          predictTeamBFlag + matchResultTeamBName + "<br/> on " + matchResultStatus;
        var matchDateDiff = Math.abs(Date.parse(matchResultStatus.trim()) - new Date());
        var diffDays = Math.ceil(matchDateDiff / (1000 * 3600 * 24));
        if (diffDays <= 2) {
          isUpcoming = true;
        }
      }
      tbdytdName = document.createElement('td');
      tbdytdName.innerHTML = matchResultString;
      tbdytdName.setAttribute('rowspan', predictParticipationTrack[currentMatchNo]);
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


    var predictString = "";
    if ((0 == predictTeamAScore.length) && (0 == predictTeamBScore.length)) {
      //upcoming prediction
      predictString = "📅Upcoming";
    } else if ((-1 == predictTeamAScore) && (-1 == predictTeamBScore)) {
      //skipped prediction
      predictString = "⌛Skip";
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

    if (isUpcoming && tournamentStillOn) {
      upcomingTbdy.appendChild(tbdytr.cloneNode(true));
    }

    tbdytr.appendChild(tbdytdName);

    //If you want to show only active stage prediction score uncomment below.
    //if (currentMatchNo >= activeStageMatchNumber) 
    {
      tbdy.appendChild(tbdytr);
    }

    location.hash = "features";
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
  if ($("#featuredetail-header").exists()) {
    $("#featuredetail-header").remove();
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

  if (tournamentStillOn == true) {
    $("#upcomingdetails").append(upcomingDiv1);
    if ( upcomingTbdy.childElementCount == 0) {
      var tbdytr = document.createElement('tr');
      var tbdytdName = document.createElement('td');
      tbdytdName.textContent = "Predictions are pending. Wait for particpants to submit the predictions.";
      tbdytdName.setAttribute('colspan', thead.children[0].children.length);
      tbdytr.appendChild(tbdytdName);
      upcomingTbdy.appendChild(tbdytr);
    }
  
    upcomingTbl.appendChild(upcomingTblHead);
    upcomingTbl.appendChild(upcomingTbdy);

    $("#upcomingdetails").append(upcomingTbl);
  }

  $("#leaderboarddetails").append(createLeaderBoard2(leaderboard,
    leaderboardPredictScorePlusWinnerGameCount,
    leaderboardPredictWinnerGameCount,
    leaderboardPredictLossesGameCount,
    leaderboardPredictMatchesScorePlusWinner,
    leaderboardPredictMatchesWinner,
    leaderboardPredictMatchesLost,
    sortedLeaderboard));
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
  var leaderBrdDiv1 = document.createElement('div');
  leaderBrdDiv1.setAttribute('class', 'section-heading text-center');
  leaderBrdDiv1.setAttribute('id', 'featuredetail-header');

  var leaderBrdDiv1H2 = document.createElement('h2');
  leaderBrdDiv1H2.innerHTML = 'Leader Board - ' + tournamentName;
  leaderBrdDiv1.append(leaderBrdDiv1H2);

  var leaderBrdDiv1Desc = document.createElement('p');
  leaderBrdDiv1Desc.setAttribute('class', 'text-muted');
  leaderBrdDiv1Desc.innerHTML = 'Leader board shows the overrall points of the participants.';
  leaderBrdDiv1.append(leaderBrdDiv1Desc);


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
      "<div style=\"font-size: 0.8em\">" +
      "Score: " + leaderboardPredictScorePlusWinnerGameCount[pName] +
      ", Win: " + leaderboardPredictWinnerGameCount[pName] +
      ", Fail: " + leaderboardPredictLossesGameCount[pName] +
      "</div>";

    //add leader row
    trow.appendChild(thead1);
    trow.appendChild(thead2);
    trow.appendChild(tpoint1);
    tLbdy.appendChild(trow);
  }

  leaderTbl.appendChild(tLbdy);

  leaderBrdDiv1.append(leaderTbl);

  return leaderBrdDiv1;
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
      
      //update total prediction points
      leaderBoardItem[keyOptions[1]] += predictPoints;

      //count correct score prediction
      if (predictPoints == matchStages[currentMatchStage].ScoreAndWinnerPoints) {
        leaderBoardItem[keyOptions[2]] += 1;
      }

      //count winner only predictions
      if (predictPoints >= matchStages[currentMatchStage].WinnerOnlyPoints) {
        leaderBoardItem[keyOptions[3]] += 1;
      }

      //count lost predictions
      if (predictPoints == matchStages[currentMatchStage].LostPoints) {
        leaderBoardItem[keyOptions[4]] += 1;
      }

      //update total number of matches
      leaderBoardItem[keyOptions[5]] += 1;

      matchStages.forEach(initializeStageLeaderBoards);

      function initializeStageLeaderBoards(value, index, array) {
        //stage points, prefect prediction, winner only & lost
        leaderBoardItem[value['Desc'] + " points"] += predictPoints;
        if (predictPoints == matchStages[currentMatchStage].ScoreAndWinnerPoints) {
          leaderBoardItem[value['Desc'] + " score predict matches"] += 1;
        }

        if (predictPoints >= matchStages[currentMatchStage].WinnerOnlyPoints) {
          leaderBoardItem[value['Desc'] + " winner predict matches"] += 1;
        }

        if (predictPoints == matchStages[currentMatchStage].LostPoints) {
          leaderBoardItem[value['Desc'] + " predict lost matches"] += 1;
        }
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