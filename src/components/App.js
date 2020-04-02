import React, { Component } from 'react';
import moment from 'moment'

import GoogleChart from './GoogleChart'
import SummaryData from './SummaryData'
import { fetchSummaryData, fetchCases } from '../api/covid-data'
import { getNewCaseCoordinates, getTotalCaseCoordinates } from '../helpers/coordinates'

const firstConfirmedCaseDay = new Date('2020-02-26')
let today = new Date()
// let thirtyDaysAgo = moment().subtract(30, 'days').toDate()

class App extends Component {

  constructor() {
    super()
    this.state = {
      summaryData: null,
      caseData: {},
      currentChartData: [],
      chosenCaseSet: [],
      chosenDataType: "total"
    }
  }

  componentDidMount() {
    // Fetch case summary data
    fetchSummaryData()
      .then(data => {
        this.setState({ summaryData: data })
      })
    // Fetch cases, then sets as data for chart
    // Initially shows confirmed + probable cases, with total type data
    fetchCases()
      .then(data => {
        this.setState({
          caseData: data
        }, () => {
          this.setState({
            chosenCaseSet: this.getAllCases()
          }, () => this.setChartData())
        })
      })
      .catch(err => this.setState({ currentChartData: null }))
  }

  // Sets coordinates for chart based on chosen case type and chosen data type
  setChartData = () => {
    switch(this.state.chosenDataType) {
      case "total":
        this.setState({
          currentChartData: getTotalCaseCoordinates(this.state.chosenCaseSet, firstConfirmedCaseDay, today)
        })
        break;
      case "new":
        this.setState({
          currentChartData: getNewCaseCoordinates(this.state.chosenCaseSet, firstConfirmedCaseDay, today)
        })
        break;
    }
  }

  // Gets confirmed + probable cases
  getAllCases = () => {
    return this.state.caseData.confirmed.concat(this.state.caseData.probable)
  }

  // Gets only confirmed cases
  getConfirmedCases = () => {
    return this.state.caseData.confirmed
  }

  // Toggle between showing total no. cases, no. of new cases
  // Calls chart data setter
  toggleDataType = e => {
    e.preventDefault()
    switch(e.target.value) {
      case "total":
        this.setState({ chosenDataType: "total" }, () => this.setChartData())
        break;
      case "new":
        this.setState({ chosenDataType: "new" }, () => this.setChartData())
        break;
    }
  }

  // Toggle between showing all cases or confirmed cases only
  // Calls chart data setter
  toggleCaseType = e => {
    e.preventDefault()
    switch(e.target.value) {
      case "both":
        this.setState({ chosenCaseSet: this.getAllCases() }, () => this.setChartData())
        break;
      case "confirmed":
        this.setState({ chosenCaseSet: this.getConfirmedCases() }, () => this.setChartData())
        break;
    }
  }

  render() {
    return (
      <div className="App">
        <div className="header">
          <h1>COVID-19 in NEW ZEALAND</h1>
        </div>
        <div className="navigation">
          <button value="total"
                  disabled={this.state.chosenDataType === "total"}
                  onClick={e => this.toggleDataType(e)}>TOTAL CASES</button>
          <button value="new"
                  disabled={this.state.chosenDataType === "new"}
                  onClick={e => this.toggleDataType(e)}>NEW CASES</button>
        </div>
        <div className="site-content">
          <GoogleChart data={this.state.currentChartData} toggleCaseType={this.toggleCaseType} />
          <SummaryData data={this.state.summaryData} />
        </div>
      </div>
    );
  }
}

export default App;
