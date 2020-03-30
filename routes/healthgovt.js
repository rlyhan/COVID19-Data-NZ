const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio')

const router = express.Router();

const summary = 'https://www.health.govt.nz/our-work/diseases-and-conditions/covid-19-novel-coronavirus/covid-19-current-situation/covid-19-current-cases'
const confirmedCases = 'https://www.health.govt.nz/our-work/diseases-and-conditions/covid-19-novel-coronavirus/covid-19-current-situation/covid-19-current-cases/covid-19-current-cases-details'

router.get('/summary', (req, res) => {
  return axios.get(summary)
    .then(page => {
      res.send(page.data)
    })
    .catch(err => {
      res.status(500).json({})
    })
})

router.get('/confirmed', (req, res) => {
  return axios.get(confirmedCases)
    .then(page => {
      res.send(page.data)
    })
    .catch(err => {
      res.status(500).json({})
    })
})

module.exports = router
