import React from 'react'
import Chart from 'react-google-charts'

const BarChart = props => {
  return (
    <>
    { props.data === [] ?
      <div>Loading...</div> :
      props.data === null ?
      <div>Could not fetch data. Please try again.</div> :
      <Chart
        className="google-bar-chart"
        chartType="Bar"
        loader={<div>Loading Chart...</div>}
        data={props.data}
        chartEvents={[
          {
            eventName: 'animationfinish',
            callback: () => {
              console.log('Animation Finished')
            },
          },
        ]}
        options={{
          animation: {
            startup: true,
            easing: 'in',
            duration: 1500
          },
          width: '100%',
          height: '500px',
          // theme: 'material',
          bars: 'horizontal',
          axes: {
            x: {
              0: { side: 'top'}
            },
            y: {
              0: { label: '' }
            }
          },
          bar: { groupWidth: '40%' },
          legend: { position: 'none' }
        }}
        chartEvents={[
          {
            eventName: 'animationfinish',
            callback: () => {
              console.log('Animation Finished')
            },
          },
        ]}
        rootProps={{ 'data-testid': '2' }}
      /> }
    </>
  )
}

export default BarChart
