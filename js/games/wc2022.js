var wc2022ResultsURL = "https://betwc.blob.core.windows.net/betwec/results-wc2022.csv?ver=" + Math.random();
var wc2022PredictionDataURL = "https://betwc.blob.core.windows.net/betwec/predict-wc2022.csv?ver="+ Math.random();

//TODO: Move these into config
var wc2022MatchStages = [
    //Groupstage match day1
    {
      MatchNumber: 1,
      Desc: 'Groupstage first match',
      StageStartDate: 'November 21, 2022',
      StageEndDate: 'November 24, 2022',
      Stage: 1,
      ScoreAndWinnerPoints: 3,
      WinnerOnlyPoints: 1,
      LostPoints: 0
    },
    //Groupstage match day2
    {
      MatchNumber: 17,
      Desc: 'Groupstage second match',
      StageStartDate: 'November 25, 2022',
      StageEndDate: 'November 28, 2022',
      Stage: 2,
      ScoreAndWinnerPoints: 3,
      WinnerOnlyPoints: 1,
      LostPoints: 0
    },
    //Groupstage match day3
    {
      MatchNumber: 34,
      Desc: 'Groupstage thrid match',
      StageStartDate: 'November 29, 2022',
      StageEndDate: 'December 2, 2022',
      Stage: 3,
      ScoreAndWinnerPoints: 3,
      WinnerOnlyPoints: 1,
      LostPoints: 0
    },
    //round 16
    {
      MatchNumber: 50,
      Desc: 'Round of 16',
      StageStartDate: 'December 3, 2022',
      StageEndDate: 'December 6, 2022',
      Stage: 4,
      ScoreAndWinnerPoints: 3,
      WinnerOnlyPoints: 1,
      LostPoints: 0
    },
    //quarter finals
    {
      MatchNumber: 58,
      Desc: 'Quarter finals',
      StageStartDate: 'December 9, 2022',
      StageEndDate: 'December 10, 2022',
      Stage: 5,
      ScoreAndWinnerPoints: 5,
      WinnerOnlyPoints: 3,
      LostPoints: -1
    },
    //semi finals
    {
      MatchNumber: 62,
      Desc: 'Semi finals',
      StageStartDate: 'December 13, 2022',
      StageEndDate: 'December 14, 2022',
      Stage: 6,
      ScoreAndWinnerPoints: 15,
      WinnerOnlyPoints: 5,
      LostPoints: -5
    },
    //winner & loser finals
    {
      MatchNumber: 64,
      Desc: 'Finals',
      StageStartDate: 'December 17, 2022',
      StageEndDate: 'December 18, 2022',
      Stage: 7,
      ScoreAndWinnerPoints: 40,
      WinnerOnlyPoints: 15,
      LostPoints: -10,
      IsFinal: 'True'
    }
  ];