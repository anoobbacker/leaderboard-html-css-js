# Overview
This is a friendly fun project created after going through the pain of building custom things to calculate the leaderboard for the match predictions during the World Cup 2018, & Euro Cup 2020. I will be updating this for World Cup 2022. This can be used as the dashboard for the social betting between friends.

This uses bootstrap's static single pages design suited best for all devices like mobile, desktop etc.

**[View Live Preview](https://anoobbacker.github.io/leaderboard-html-css-js/)**

# Usage
Fork this project and peform the following steps to customize it for you and your friends:
1. `_data/*` has sample files for prediction and results. You need to update the files for you friends. Use an either online form like Microsoft Forms or Microsoft Excel to collect all the prediction scores from your friends.
2. Upload the CSV files in a publicly accessible read-only storage location. You can use Azure Storage account for uploading the CSV, set the CORS, and set the appropriate permission. The browser just needs a read-only access to these CSV files.
3. Update `betwc/js/games/*.js` to point to the publicly accessible CSV
4. Upload the Avatars for your friends under `betwc/assets/img/`. The final name for the Avatar should be like `Anoob.png`. Use the same name used in the CSV files for the Avatar image name. 
5. Edit `index.html` and update `aside` with all the Avatar img URLs.

To view a preview open the `index.html` file in your web browser after making the changes.

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
- Improve the documentation
- Improve the code to make it modular, reusable, configurable
- Add support for localization
- Add unit tests
- Automate the collecting prediction input from friends.
- Fetch match schedule, match results and particpant prediction using API.
- Integrate with DevOps CI/CD

# Tools used
- Avatars generated from [Getavataaars](https://getavataaars.com).
- Bootstrap template [New Age](https://github.com/BlackrockDigital/startbootstrap-new-age)
- Parsing of CSV using [Papa parse](http://papaparse.com/)

# Copyright and License
Code released under the [MIT](https://github.com/anoobbacker/betwc/blob/master/LICENSE) license.
