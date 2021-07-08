var wc2018ResultsURL = "https://betwc.blob.core.windows.net/betwec/results-wc2018.csv?ver=" + Math.random();
var wc2018PredictionDataURL = "https://betwc.blob.core.windows.net/betwec/predict-wc2018.csv?ver="+ Math.random();

var wc2018MatchStages = [
    //Groupstage match day1
    {
      MatchNumber: 1,
      StageStartDate: 'June 14, 2018',
      StageEndDate: 'June 19, 2018',
      Stage: 0,
      ScoreAndWinnerPoints: 3,
      WinnerOnlyPoints: 1,
      LostPoints: 0
    },
    //Groupstage match day2
    {
      MatchNumber: 17,
      StageStartDate: 'June 19, 2018',
      StageEndDate: 'June 24, 2018',
      Stage: 1,
      ScoreAndWinnerPoints: 3,
      WinnerOnlyPoints: 1,
      LostPoints: 0
    },
    //Groupstage match day3
    {
      MatchNumber: 31,
      StageStartDate: 'June 25, 2018',
      StageEndDate: 'June 28, 2018',
      Stage: 2,
      ScoreAndWinnerPoints: 3,
      WinnerOnlyPoints: 1,
      LostPoints: 0
    },
    //round 16
    {
      MatchNumber: 49,
      StageStartDate: 'June 30, 2018',
      StageEndDate: 'July 3, 2018',
      Stage: 3,
      ScoreAndWinnerPoints: 3,
      WinnerOnlyPoints: 1,
      LostPoints: 0
    },
    //quarter finals
    {
      MatchNumber: 57,
      StageStartDate: 'July 6, 2018',
      StageEndDate: 'July 7, 2018',
      Stage: 4,
      ScoreAndWinnerPoints: 5,
      WinnerOnlyPoints: 3,
      LostPoints: -1
    },
    //semi finals
    {
      MatchNumber: 61,
      StageStartDate: 'July 10, 2018',
      StageEndDate: 'July 12, 2018',
      Stage: 5,
      ScoreAndWinnerPoints: 15,
      WinnerOnlyPoints: 5,
      LostPoints: -5
    },
    //winner & loser finals
    {
      MatchNumber: 63,
      StageStartDate: 'July 14, 2018',
      StageEndDate: 'July 15, 2018',
      Stage: 6,
      ScoreAndWinnerPoints: 40,
      WinnerOnlyPoints: 15,
      LostPoints: -10
    }
  ];