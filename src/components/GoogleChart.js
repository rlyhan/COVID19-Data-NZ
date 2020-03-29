import React, { Component } from 'react'
import Chart from 'react-google-charts'

class GoogleChart extends Component {

  constructor(props) {
    super(props)
    this.state = {
      coordinates: null
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
        <Chart
          width={'600px'}
          height={'400px'}
          chartType="AnnotationChart"
          loader={<div>Loading Chart</div>}
          rows={this.props.data}
          columns={[
            {
              type: "date",
              label: "Date"
            },
            {
              type: "number",
              label: "New cases"
            }
          ]}
          chartEvents={[
            {
              eventName: 'animationfinish',
              callback: () => {
                console.log('Animation Finished')
              },
            },
          ]}
          rootProps={{ 'data-testid': '2' }}
        />
      }
      </>
    );
  }

}

export default GoogleChart
