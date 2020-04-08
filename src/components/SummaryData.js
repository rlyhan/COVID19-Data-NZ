import React, { Component } from 'react'
import BarChart from './Charts/BarChart'

class SummaryData extends Component {

  constructor(props) {
    super(props)
    this.state = {
      coordinates: []
    }
  }

  componentDidMount() {
  }

  componentDidUpdate() {
    // console.log(this.props.data)
    // this.setState({ coordinates: this.props.data })
  }

  render() {
    return (
      <>
      { this.props.data &&
        <div className="summary-data-wrapper">
          <div className="round-border">
            <div className="summary-data">
              <div className="round-border total-cases">
                <p style={{margin: 0}}><strong>{this.props.data.confirmedAndProbableCases.totalToDate}&nbsp;CASES</strong></p>
                <p style={{margin: 0}}>
                  <strong>{`${this.props.data.confirmedCases.totalToDate} confirmed + ${this.props.data.probableCases.totalToDate} probable`}</strong>
                </p>
              </div>
              <div className="recent-cases">
                <strong>{`+${this.props.data.confirmedAndProbableCases.newInLast24Hr} NEW CASES `}</strong>in the last 24 hours
                {` (${this.props.data.confirmedCases.newInLast24Hr} confirmed, ${this.props.data.probableCases.newInLast24Hr} probable)`}
              </div>
              <div className="stats">
                <div>{`${this.props.data.recoveredCases.totalToDate} RECOVERED`}</div>
                <div>{`${this.props.data.deaths.totalToDate} DEAD`}</div>
                <div>{`${this.props.data.hospitalCases.totalToDate} IN HOSPITAL`}</div>
              </div>
              {/*Object.entries(this.state.summaryData).map(([key, value]) => {
                return <p>{`${key}: ${value.totalToDate}`}</p>
              })*/}
              <div className="dhb-chart">
                <p style={{textAlign: 'center', fontSize: '0.7em'}}>CONFIRMED & PROBABLE CASES PER DISTRICT HEALTH BOARD</p>
                {
                  this.props.chartData && <BarChart data={this.props.chartData} />
                }
              </div>
            </div>
          </div>
        </div>
      }
      </>
    )
  }

}

export default SummaryData
