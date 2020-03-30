import React, { Component } from 'react';
import moment from 'moment'

import GoogleChart from './GoogleChart'
import { fetchSummaryData, fetchConfirmedCases } from '../api/covid-data'
import { confirmedCasesToCoords } from '../helpers/coordinates'

class App extends Component {

  constructor() {
    super()
    this.state = {
      currentPage: '',
      summaryData: {},
      currentData: []
    }
  }

  componentDidMount() {
    fetchSummaryData()
      .then(data => {
        this.setState({ summaryData: data })
      })

    fetchConfirmedCases()
      .then(data => {
        let today = new Date()
        let thirtyDaysAgo = moment().subtract(30, 'days').toDate()
        this.setState({ currentData: confirmedCasesToCoords(data, thirtyDaysAgo, today) })
      })
      .catch(err => this.setState({ currentData: null }))
  }

  render() {
    return (
      <div className="App">
        <GoogleChart data={this.state.currentData} />
        <div></div>
      </div>
    );
  }
}

export default App;
