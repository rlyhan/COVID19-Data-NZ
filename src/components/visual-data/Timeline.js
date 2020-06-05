import React, { Component } from 'react'

import CaseTimeline from './google-charts/CaseTimeline'

import { events } from '../../helpers/general-data'
import { convertDateToString } from '../../helpers/dates'

class GoogleChart extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedEvent: null,
      optionsShowing: false
    }
  }

  componentDidMount() {
    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false
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
        { this._isMounted && <>
            <div className="timeline">
            {
              this.props.visualType === 'case timeline' ?
              <CaseTimeline data={this.props.googleChartData}
                            caseType={this.props.caseType}
                            numberType={this.props.numberType}
                            selectedEvent={this.state.selectedEvent} /> :
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
                            checked={this.props.numberType === "new"}
                            onChange={e => this.props.toggleNumberType(e)} />
                      <span className="checkmark"></span>
                      <span className="label-text">NEW CASES</span>
                    </label>
                    <label className="radio-button" htmlFor="total" style={{marginLeft: '10px'}}>
                      <input type="radio"
                            name="total"
                            value="total"
                            checked={this.props.numberType === "total"}
                            onChange={e => this.props.toggleNumberType(e)} />
                      <span className="checkmark"></span>
                      <span className="label-text">TOTAL CASES</span>
                    </label>
                  </div>
                  <div className="toggle-menu case-type">
                    <div className="dropdown-wrapper">
                      <select onChange={this.props.toggleCaseType.bind(this)}>
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
