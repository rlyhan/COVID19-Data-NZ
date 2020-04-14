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
    console.log(this.props.data)
  }

  componentDidUpdate() {
    // this.setState({ coordinates: this.props.data })
  }

  getStatInfo = num => {
    switch(Math.sign(num)) {
      case -1:
        return `↓ ${Math.abs(num)}`
      case 1:
        return `↑ ${Math.abs(num)}`
      case 0:
        return `---`
    }
  }

  render() {
    const {
      confirmedCases,
      probableCases,
      confirmedAndProbableCases,
      recoveredCases,
      deaths,
      hospitalCases
    } = this.props.data
    return (
      <>
      { this.props.data &&
        <div className="sidebar-wrapper">
          <div className="square-border">
            <div className="summary-data">
              <div className="square-border total-cases">
                <div className="total-case-number">
                  <p style={{margin: 0}}>{confirmedAndProbableCases.totalToDate}</p>
                  <p style={{margin: 0}}>TOTAL CASES</p>
                </div>
                <div className="total-case-confirmed" style={{padding: '0 10px'}}>
                  <p>{`${confirmedCases.totalToDate} CONFIRMED`}</p>
                  <p>{`${probableCases.totalToDate} PROBABLE`}</p>
                </div>
                <div className="recent-cases">
                  <p style={{color: '#2e5cb8'}}>
                    <strong>&#8593;{` ${confirmedAndProbableCases.newInLast24Hr} NEW CASES `}</strong>
                    <span style={{color: 'white', fontSize: '0.8em'}}>
                      {`(${confirmedCases.newInLast24Hr} CONFIRMED, ${probableCases.newInLast24Hr} PROBABLE)`}
                    </span>
                  </p>
                </div>
              </div>
              <div className="stats">
                <div className="stat-container">
                  <div className="total-count">
                    <span className="label">
                      <span>
                        <img src={require('../images/icons/recovered.png')} />
                      </span>
                      <span>
                        <p>TOTAL</p><p>RECOVERED</p>
                      </span>
                    </span>
                    <span>{recoveredCases.totalToDate}</span>
                  </div>
                  {/*<span className="new-count" style={{
                    color: Math.sign(recoveredCases.newInLast24Hr) === 1 ? 'green' :
                           Math.sign(recoveredCases.newInLast24Hr) === -1 ? '#f1283a' :
                           '#212121'
                  }}> {this.getStatInfo(recoveredCases.newInLast24Hr)}</span>*/}
                </div>
                <div className="stat-container">
                  <div className="total-count">
                    <span className="label">
                      <span>
                        <img src={require('../images/icons/dead.png')} />
                      </span>
                      <span>
                        <p>TOTAL</p><p>DEATHS</p>
                      </span>
                    </span>
                    <span>{deaths.totalToDate}</span>
                  </div>
                  {/*<span className="new-count" style={{
                    color: Math.sign(deaths.newInLast24Hr) === 1 ? '#f1283a' :
                           Math.sign(deaths.newInLast24Hr) === -1 ? 'green' :
                           '#212121'
                  }}>{this.getStatInfo(deaths.newInLast24Hr)}</span>*/}
                </div>
                <div className="stat-container">
                  <div className="total-count">
                    <span className="label">
                      <span>
                        <img src={require('../images/icons/hospital.png')} />
                      </span>
                      <span>
                        <p>CURRENTLY</p><p>HOSPITALISED</p>
                      </span>
                    </span>
                    <span>{hospitalCases.totalToDate}</span>
                  </div>
                  {/*<span className="new-count" style={{
                    color: Math.sign(hospitalCases.newInLast24Hr) === 1 ? '#f1283a' :
                           Math.sign(hospitalCases.newInLast24Hr) === -1 ? 'green' :
                           '#212121'
                  }}>{this.getStatInfo(hospitalCases.newInLast24Hr)}</span>*/}
                </div>
              </div>
              <div className="calendar">
              </div>
              <div className="footer">
                <p>
                  DATA SOURCED FROM:&nbsp;
                  <a href="https://www.health.govt.nz/our-work/diseases-and-conditions/covid-19-novel-coronavirus/covid-19-current-situation/covid-19-current-cases">
                  HEALTH.GOVT.NZ</a>.
                </p>
                <p>
                  GRAPH SHOWING DATA AS OF 9AM, 14 APRIL, 2020.
                </p>
                <p>THIS SITE IS NOT AN OFFICIAL DATA SOURCE AND MAY NOT BE UP TO DATE.</p>
              </div>
              {/*Object.entries(this.state.summaryData).map(([key, value]) => {
                return <p>{`${key}: ${value.totalToDate}`}</p>
              })*/}
              {/*
              <div className="dhb-chart">
                <p style={{textAlign: 'center', fontSize: '0.7em'}}>CONFIRMED & PROBABLE CASES PER DISTRICT HEALTH BOARD</p>
                  this.props.chartData && <BarChart data={this.props.chartData} />
              </div>
              */}
            </div>
          </div>
        </div>
      }
      </>
    )
  }

}

export default SummaryData
