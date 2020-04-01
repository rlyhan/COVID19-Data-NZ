import React, { Component } from 'react';
import moment from 'moment'

import GoogleChart from './GoogleChart'
import SummaryData from './SummaryData'
import { fetchSummaryData, fetchCases } from '../api/covid-data'
import { casesToCoords } from '../helpers/coordinates'

const firstConfirmedCaseDay = new Date('2020-02-26')
let today = new Date()
// let thirtyDaysAgo = moment().subtract(30, 'days').toDate()

class App extends Component {

  constructor() {
    super()
    this.state = {
      currentPage: '',
      summaryData: null,
      caseData: {},
      currentData: []
    }
  }

  componentDidMount() {
    fetchSummaryData()
      .then(data => {
        console.log(data)
        this.setState({ summaryData: data })
      })

    fetchCases()
      .then(data => {
        this.setState({
          caseData: data,
          currentData: casesToCoords(data.confirmed.concat(data.probable), firstConfirmedCaseDay, today)
        })
      })
      .catch(err => this.setState({ currentData: null }))
  }

  toggleData = e => {
    if (e.target.value === 'both') {
      this.setState({
        currentData: casesToCoords(this.state.caseData.confirmed.concat(this.state.caseData.probable), firstConfirmedCaseDay, today)
      })
    } else if (e.target.value === 'confirmed') {
      this.setState({
        currentData: casesToCoords(this.state.caseData.confirmed, firstConfirmedCaseDay, today)
      })
    }
  }

  render() {
    return (
      <div className="App">
        <div className="header">
          <h1>COVID-19 in NEW ZEALAND</h1>
        </div>
        <div className="site-content">
          <GoogleChart data={this.state.currentData} toggle={this.toggleData} />
          <SummaryData data={this.state.summaryData} />
        </div>
      </div>
    );
  }
}

export default App;
