# Overview
This is a friendly project created after going through the pain of building custom things to calculate the leaderboard for a friendly prediction during the World Cup 2018, & Euro Cup 2020. I will be updating this for World Cup 2022. This can be used as the dashboard for the social betting between friends. The web pages are constructed using bootstrap  design for using on mobile devices.

# Usage
I used an online form to collect all the prediction scores from my friends and then uploaded the CSV file under `_data` folder. The `_data/predict*.csv` captures the predictions by friends. Another file `_data/results*.csv` captures the outcome of the match results.

After forking this project, edit the below files:
1. `_data/*` files you need to update and upload the CSV files in a publicly accessible storage.
2. Update `betwc/js/games/*.js` to point to the publicly accessible storage location
3. Change Avatar for your friends under `betwc/img/`. 

To preview the changes you make to the code, you can open the `index.html` file in your web browser.

# Scoring

- Till quarterfinals, a perfect guess of score & the winner will bag 3-points. It will be 1-point if you predicted only the winner.
- From quarterfinals, a perfect guess of score & the winner is 5-points. If you predicted only the winner it will be 3-points. A wrong prediction will result in a deduction of 1-point.
- From semifinals, a perfect guess of score & the winner is 15-points. If you predicted only the winner it will be 5-points. A wrong prediction will result in a deduction of 5-point.
- From finals, a perfect guess of score & the winner is 40-points. If you predicted only the winner it will be 15-points. A wrong prediction will result in a deduction of 10-point.

# Preview
**[View Live Preview](https://anoobbacker.github.io/betwc/)**

# To do
- Automate the collecting prediction input from friends.
- Automate fetching results of the games using API.

# Tools used
- Avatars generated from [Getavataaars](https://getavataaars.com).
- Bootstrap template [New Age](https://github.com/BlackrockDigital/startbootstrap-new-age)
- Parsing of CSV using [Papa parse](http://papaparse.com/)

# Copyright and License
Code released under the [MIT](https://github.com/anoobbacker/betwc/blob/master/LICENSE) license.
