import React, { Component } from 'react'

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
                <p style={{margin: 0}}><b>{this.props.data.confirmedAndProbableCases.totalToDate}&nbsp;cases</b></p>
                <p style={{margin: 0}}>
                  <strong>{`${this.props.data.confirmedCases.totalToDate} confirmed + ${this.props.data.probableCases.totalToDate} probable`}</strong>
                </p>
              </div>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <strong>{`+${this.props.data.confirmedAndProbableCases.newInLast24Hr} `}</strong>new cases in the last 24 hours
                      {` (${this.props.data.confirmedCases.newInLast24Hr} confirmed, ${this.props.data.probableCases.newInLast24Hr} probable)`}
                    </td>
                  </tr>
                </tbody>
              </table>
              <table>
                <tbody>
                  <tr><td>{`${this.props.data.recoveredCases.totalToDate} RECOVERED`}</td></tr>
                  <tr><td>{`${this.props.data.deaths.totalToDate} DEAD`}</td></tr>
                  <tr><td>{`${this.props.data.hospitalCases.totalToDate} CURRENTLY HOSPITALISED`}</td></tr>
                </tbody>
              </table>
              {/*Object.entries(this.state.summaryData).map(([key, value]) => {
                return <p>{`${key}: ${value.totalToDate}`}</p>
              })*/}
            </div>
          </div>
        </div>
      }
      </>
    )
  }

}

export default SummaryData
