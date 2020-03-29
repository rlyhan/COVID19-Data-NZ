import React, { Component } from 'react';
import moment from 'moment'

import GoogleChart from './GoogleChart'
import { fetchConfirmedCases } from '../api/covid-data'
import { confirmedCasesToCoords } from '../helpers/coordinates'

class App extends Component {

  constructor() {
    super()
    this.state = {
      currentPage: '',
      currentData: []
    }
  }

  componentDidMount() {
    fetchConfirmedCases()
      .then(data => {
        let today = new Date()
        let thirtyDaysAgo = moment().subtract(30, 'days').toDate()
        this.setState({ currentData: confirmedCasesToCoords(data, thirtyDaysAgo, today) })
      })
  }

  render() {
    return (
      <div className="App">
        <GoogleChart data={this.state.currentData} />
      </div>
    );
  }
}

export default App;
