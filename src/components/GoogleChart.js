import React, { Component } from 'react'

import AnnotationChart from './Charts/AnnotationChart'
import BarChart from './Charts/BarChart'

class GoogleChart extends Component {

  constructor(props) {
    super(props)
    this.state = {
      coords: []
      // numberType: "total"
    }
  }

  componentDidMount() {
    console.log(this.props)
    // if (this.chartWrapper) {
    //   window.addEventListener('resize', this.drawChart, {capture: true})
    // }
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      console.log(this.props)
      // this.setState({ numberType: this.props.numberType })
      // console.log("Passed to chart:", this.props.data)
    }
  }

  setHeight = () => {
    return document.querySelector('.google-chart-wrapper').offsetWidth * 0.85
  }

  render() {
    // console.log(document.querySelector('.google-chart').offsetWidth)
    return (
      <div className="google-chart-wrapper">
        <div className="google-chart">
          {
            this.props.chartType === 'annotation' ?
            <AnnotationChart data={this.props.data} numberType={this.props.numberType} /> :
            this.props.chartType === 'bar' ?
            <BarChart data={this.props.data} /> :
            null
          }
        </div>
        <div className="toggle-menu-wrapper">
          {this.props.chartType === 'annotation' && <div className="toggle-menu">
            <label className="radio-button" htmlFor="total">
              <input type="radio"
                     name="total"
                     value="total"
                     checked={this.props.numberType === "total"}
                     onChange={e => this.props.toggleNumberType(e)} />
              <span className="checkmark"></span>
              <span className="label-text">TOTAL CASES</span>
            </label>
            <label className="radio-button" htmlFor="new" style={{marginLeft: '10px'}}>
              <input type="radio"
                     name="new"
                     value="new"
                     checked={this.props.numberType === "new"}
                     onChange={e => this.props.toggleNumberType(e)} />
              <span className="checkmark"></span>
              <span className="label-text">NEW CASES</span>
            </label>
          </div>}
          <div className="toggle-menu">
            <select onChange={this.props.toggleCaseType.bind(this)}>
              <option value="both">CONFIRMED + PROBABLE CASES</option>
              <option value="confirmed">CONFIRMED CASES ONLY</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

}

export default GoogleChart
