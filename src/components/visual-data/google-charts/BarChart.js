import React from 'react'
import Chart from 'react-google-charts'

const BarChart = props => {
  let chartHeight
  if (window.screen.width > window.screen.height) chartHeight = '70vh'
  else chartHeight = '50vh'
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
          height: chartHeight,
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
        rootProps={{ 'data-testid': '2' }}
      /> }
    </>
  )
}

export default BarChart
