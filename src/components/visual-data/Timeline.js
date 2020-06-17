import React, { Component } from 'react'

import CaseTimeline from './google-charts/CaseTimeline'

import { events } from '../../helpers/general-data'
import { convertDateToString } from '../../helpers/dates'
import { getLineCoordinates } from '../../helpers/coordinates'
import { firstConfirmedCaseDay } from '../../helpers/dates'

var today = new Date()

class GoogleChart extends Component {

  constructor(props) {
    super(props)
    this.state = {
      chartData: [],
      chartDate: null,
      timelineType: 'cases',
      chosenCaseSet: [], // Array of selected cases to be sent as co-ords
      chosenCaseType: "confirmed and probable", // Tells whether to get CONFIRMED + PROBABLE / CONFIRMED ONLY cases
      chosenNumberType: "new", // Tells which co-ordinates to get, ie. TOTAL or NEW
      selectedEvent: null,
      optionsShowing: false
    }
  }

  componentDidMount() {
    this.setChartData()
    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  // Helper: Gets ALL CASES from API data as array
  getAllCases = () => {
    return this.props.apiCaseData.confirmed.concat(this.props.apiCaseData.probable)
  }

  // Helper: Gets CONFIRMED CASES ONLY from API data as array
  getConfirmedCases = () => {
    return this.props.apiCaseData.confirmed
  }

  // Helper: Gets cases based on whether CONFIRMED or CONFIRMED + PROBABLE cases selected
  getCasesByType = () => {
    if (this.state.chosenCaseType === "confirmed and probable") return this.getAllCases()
    else if (this.state.chosenCaseType === "confirmed") return this.getConfirmedCases()
  }

  // Fetches coordinates for chart
  // 1. Initially have chosen case set in state (all or confirmed cases)
  // 2. Fetches coordinates based on chart type
  setChartData = () => {
    this.setState({
      chosenCaseSet: this.getCasesByType()
    }, () => {
      switch(this.state.timelineType) {
        case "cases":
          this.setState({
            chartData: getLineCoordinates(
              this.state.chosenCaseSet, 
              firstConfirmedCaseDay, 
              today, 
              this.state.chosenNumberType
            )
          })
          break;
        // case "tests":
        //   break;
        default:
          break;
      }
    })
  }

  // Toggle between getting TOTAL NO. CASES / NO. OF NEW CASES (for case timeline chart only)
  // Calls chart data setter
  toggleNumberType = e => {
    this.setState({ chosenNumberType: e.target.value }, () => this.setChartData())
  }

  // Toggles filtering of CONFIRMED + PROBABLE CASES / CONFIRMED CASES ONLY
  // Sets selected case type as a filter
  // Calls chart data setter
  toggleCaseType = e => {
    e.preventDefault()
    this.setState({ chosenCaseType: e.target.value }, () => this.setChartData())
  }

  toggleOptionsVisibility = () => {
    // Display chart data options
    this.setState({ optionsShowing: !this.state.optionsShowing })
    if (document.querySelector('.toggle-menu-wrapper').classList.contains('show-options')) {
      document.querySelector('.toggle-menu-wrapper').classList.remove('show-options')
    } else {
      document.querySelector('.toggle-menu-wrapper').classList.add('show-options')
    }
    // Toggle whether options button is clicked
    if (document.querySelector('.toggle-options').classList.contains('options-clicked')) {
      document.querySelector('.toggle-options').classList.remove('options-clicked')
    } else {
      document.querySelector('.toggle-options').classList.add('options-clicked')
    }
  }

  render() {
    return (
      <>
        { this._isMounted && this.state.chartData && <>
          <div className="timeline">
          {
            this.state.timelineType === 'cases' ?
            <CaseTimeline data={this.state.chartData}
                          caseType={this.state.chosenCaseType}
                          numberType={this.state.chosenNumberType}
                          selectedEvent={this.state.selectedEvent} />  :
                          null
          }
          <div className="events">
            <table className="events-table">
              <tbody>
              {
                events.map((anEvent, index) =>
                  <tr key={index}>
                    <td className="event-marker">
                      <div onClick={() => this.setState({ selectedEvent: String.fromCharCode(index+65) })}>
                        {String.fromCharCode(index+65)}
                      </div>
                    </td>
                    <td>
                      <span className="event-title">
                        {anEvent.title.toUpperCase()}&nbsp;
                      </span>
                      <span className="event-description">
                        {anEvent.description.toUpperCase()}&nbsp;
                      </span>
                      <span className="event-date">
                        {convertDateToString(anEvent.date, 'text').toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ).reverse()
              }
              </tbody>
            </table>
          </div>
          </div>
          <div className="toggle-menu-wrapper">
            <div className="toggle-menu case-range">
              <div className="google-range-filter"/>
            </div>
            <div className="toggle-options" onClick={this.toggleOptionsVisibility}>
              {`${this.state.optionsShowing ? 'HIDE' : 'SHOW'} OPTIONS`}
            </div>
            { this.state.optionsShowing &&
              <>
                <div className="toggle-menu case-number">
                  <label className="radio-button" htmlFor="new">
                    <input type="radio"
                          name="new"
                          value="new"
                          checked={this.state.chosenNumberType === "new"}
                          onChange={e => this.toggleNumberType(e)} />
                    <span className="checkmark"></span>
                    <span className="label-text">NEW CASES</span>
                  </label>
                  <label className="radio-button" htmlFor="total" style={{marginLeft: '10px'}}>
                    <input type="radio"
                          name="total"
                          value="total"
                          checked={this.state.chosenNumberType === "total"}
                          onChange={e => this.toggleNumberType(e)} />
                    <span className="checkmark"></span>
                    <span className="label-text">TOTAL CASES</span>
                  </label>
                </div>
                <div className="toggle-menu case-type">
                  <div className="dropdown-wrapper">
                    <select onChange={this.toggleCaseType.bind(this)}>
                      <option value="confirmed and probable">CONFIRMED + PROBABLE CASES</option>
                      <option value="confirmed">CONFIRMED CASES ONLY</option>
                    </select>
                  </div>
                </div>
              </>
            }
          </div>
        </> }
      </>
    )
  }
}

export default GoogleChart
