import React, { Component } from 'react'

import AnnotationChart from './Charts/AnnotationChart'
import BarChart from './Charts/BarChart'
import Mapbox from './Charts/Mapbox'

class VisualData extends Component {

  constructor(props) {
    super(props)
    this.state = {
      coords: []
    }
  }

  componentDidMount() {
    console.log("MOUNT")
  }

  componentWillUnmount() {
    console.log("UNMOUNT")
  }

  render() {
    return (
      <>
        <div className="visual-data">
          {
            this.props.visualType === 'case timeline' ?
            <AnnotationChart data={this.props.googleChartData}
                             caseType={this.props.caseType}
                             numberType={this.props.numberType} /> :
            this.props.visualType === 'bar' ?
            <BarChart data={this.props.googleChartData} /> :
            this.props.visualType === 'map' ?
            <Mapbox data={this.props.dhbData} /> :
            null
          }
        </div>
        {(this.props.visualType === 'case timeline' || this.props.visualType === 'bar') &&
        <div className="toggle-menu-wrapper">
          <div className="toggle-menu">
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
          <div className="toggle-menu">
            <select onChange={this.props.toggleCaseType.bind(this)}>
              <option value="confirmed and probable">CONFIRMED + PROBABLE CASES</option>
              <option value="confirmed">CONFIRMED CASES ONLY</option>
            </select>
          </div>
        </div>}
      </>
    );
  }

}

export default VisualData
