var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/scrape', function (req, res) {
  // Let's scrape Anchorman 2
  url = 'http://www.atpworldtour.com/en/tournaments';

  request(url, function (error, response, html) {
    if (!error) {
      var $ = cheerio.load(html);

      var title, release, date, tournaments;
      var json = { tournaments: { months: [] }, title: "", date: "" };

      $(".accordion-label").each(function (index) {

        var data = $(this),
          tournament = $('.tourney-result'),
          monthFormat = data.text().trim().split(" "),
          tournamentTitle = [],
          tournamentCity = [],
          month = monthFormat[0]


        data.siblings('.centered-content-wrapper').find('.tourney-result.tourney-result').each(function (index) {

          tournaCity = $(this).find('.tourney-location').text().trim();
          tournaTitle = $(this).find('.tourney-title').text().trim();
          tournamentTitle.push(tournaTitle);
          tournamentCity.push(tournaCity);
        });

        json.tournaments.months.push({ month: month[0], tournament: { tournamentTitle, tournamentCity } });

      });

      // $('.player-profile-hero-name').filter(function () {
      //   var data = $(this);

      //   title = data.children().first().text().trim();
      //   json.title = title;
      //   // json.release = release;
      // });

      // $('.hero-date-range').filter(function () {
      //   var data = $(this);
      //   date = data.text().trim();

      //   json.date = date;
      // });


    }

    fs.writeFile('output.json', JSON.stringify(json, null, 4), function (err) {
      console.log('File successfully written! - Check your project directory for the output.json file');
    })

    res.send('Check your console!')
  })
})

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
