# Overview
This is a friendly fun project created after going through the pain of building custom things to calculate the leaderboard for the match predictions during the World Cup 2018, & Euro Cup 2020. I will be updating this for World Cup 2022. This can be used as the dashboard for the social betting between friends.

This uses bootstrap's static single pages design suited best for all devices like mobile, desktop etc.

**[View Live Preview](https://anoobbacker.github.io/betwc/)**

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

# Screenshots
![screen1](https://user-images.githubusercontent.com/13219906/200187454-4cf46c9b-16be-43bb-b184-e8ff3d3a3ed7.jpeg)
![worldcup2018](https://user-images.githubusercontent.com/13219906/200187563-b75bfd8f-5cb4-4ac1-bd78-9c95ae530a1d.jpeg)
![euro2020](https://user-images.githubusercontent.com/13219906/200187570-c9ff53e5-398b-4253-a708-e04a1f49c076.jpeg)


# To do
- Automate the collecting prediction input from friends.
- Automate fetching results of the games using API.
- Improve the documentation
- Improve the code to make it modular, reusable, configurable
- Add support for localization

# Tools used
- Avatars generated from [Getavataaars](https://getavataaars.com).
- Bootstrap template [New Age](https://github.com/BlackrockDigital/startbootstrap-new-age)
- Parsing of CSV using [Papa parse](http://papaparse.com/)

# Copyright and License
Code released under the [MIT](https://github.com/anoobbacker/betwc/blob/master/LICENSE) license.
