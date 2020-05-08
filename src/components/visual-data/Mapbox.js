import React, { Component } from 'react'
import mapboxgl from 'mapbox-gl'
import { dhbList } from '../../helpers/general-data'
import { getRegularCaseString, camelToSpaceCase } from '../../helpers/general-helpers'
import { addDHBRegions, createPointsSource } from '../../helpers/mapbox/main-data'
import { changeDisplayData } from '../../helpers/mapbox/counters'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN
var chartHeight

class Mapbox extends Component {

  constructor(props) {
    super(props)
    this.state = {
      lng: 172.515,
      lat: -41.206,
      zoom: 4.2,
      mapLoaded: false,
      displayData: 'total'
    }
    if (window.screen.width > window.screen.height) chartHeight = '80vh'
    else chartHeight = '60vh'
  }

  componentDidMount() {
    var { data } = this.props
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/rlyhan/ck98cd91l3zpm1imxqvljfg9y',
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom
    })
    // Add full screen button
    map.addControl(new mapboxgl.FullscreenControl())

    // On map load...
    var hoveredStateId = null
    var currentPopup = null
    map.on('load', () => {
      // Add the main data (mapped district health board regions)
      map.addSource('mapbox-dhb', {
        type: 'vector',
        url: 'mapbox://rlyhan.4ym0j96h'
      })
      addDHBRegions(map, hoveredStateId)
      createPointsSource(map)
      changeDisplayData(this.state.displayData, map, data, dhbList)
    })

    // Create filters
    var filterBox = document.querySelector('.map-filter-box')
    // if (document.querySelector('.map-filters')) filterBox.removeChild(document.querySelector('.map-filters'))
    var filterList = document.createElement('div')
    filterList.className = 'map-filters'
    filterBox.appendChild(filterList)
    var displayDataNames = ['districtHealthBoardName', 'total', 'active', 'last24Hours', 'recovered', 'deceased']
    displayDataNames.forEach(function(displayData) {
      // Label
      var label = document.createElement('label')
      label.className = 'radio-button'
      label.htmlFor = displayData
      // Radio button
      var radio = document.createElement('input')
      radio.type = 'radio'
      radio.name = displayData
      radio.value = displayData
      radio.checked = this.state.displayData === displayData
      radio.onchange = function() {
        // Hide popup (if any)
        if (currentPopup) currentPopup.remove()
        // Uncheck other radio buttons
        document.querySelectorAll('input').forEach(radioBtn => radioBtn.checked = false)
        // Check this radio button
        radio.checked = true
        this.setState({ displayData: displayData })
        // Change the data displayed
        changeDisplayData(displayData, map, data, dhbList)
      }.bind(this)
      label.appendChild(radio)
      // Checkmark
      var checkmark = document.createElement('span')
      checkmark.className = 'checkmark'
      label.appendChild(checkmark)
      // Label text
      var labelText = document.createElement('span')
      labelText.className = 'label-text'
      labelText.innerText = displayData === 'last24Hours' ? 'LAST 24 HOURS' : camelToSpaceCase(displayData).toUpperCase()
      label.appendChild(labelText)
      // Add to filter box
      filterList.appendChild(label)
      // If just created the DHB checkmark, add a label indicating CASE TYPE for the following filters
      if (displayData === 'districtHealthBoardName') {
        var caseTypesLabel = document.createElement('p')
        caseTypesLabel.innerText = 'CASE TYPES'
        filterList.appendChild(caseTypesLabel)
      }
    }.bind(this))
    filterBox.style.display = 'block'

    // Once map has loaded...
    map.once('load', () => {
      // Be able to move the map
      map.on('move', () => {
        this.setState({
          lng: map.getCenter().lng.toFixed(4),
          lat: map.getCenter().lat.toFixed(4),
          zoom: map.getZoom().toFixed(2)
        })
      })
      // Show popup on clicking DHB
      map.on('click', 'points', function(e) {
        // Remove current popup
        if (currentPopup) currentPopup.remove()
        // Center view upon popup
        map.flyTo({ center: e.features[0].geometry.coordinates, zoom: 8 })
        // Get coordinates and DHB name
        var coordinates = e.features[0].geometry.coordinates.slice()
        var title = getRegularCaseString(e.features[0].properties.title)
        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
        }
        // Place a popup
        currentPopup = new mapboxgl.Popup({ className: 'popup' })
          .setLngLat(coordinates)
          .setHTML(getPopupHTML(title))
          .addTo(map)
      })
      // Go to central marker on clicking an area of DHB
      map.on('click', 'dhb-highlight-fills', function(e) {
        // If clicked on area outside all DHBs, return
        if (e.features[0].id >= 21) return
        // Remove current popup
        if (currentPopup) currentPopup.remove()
        // Find out name of DHB of clicked area and go to its center
        var clickedDHB = dhbList.find(dhb =>
          dhb.name === getRegularCaseString(e.features[0]._vectorTileFeature.properties.DHB2015_Na)
        )
        var coordinates = [clickedDHB.lng, clickedDHB.lat]
        map.flyTo({ center: coordinates, zoom: 8 })
        // Place a popup
        currentPopup = new mapboxgl.Popup({ className: 'popup' })
          .setLngLat(coordinates)
          .setHTML(getPopupHTML(clickedDHB.name))
          .addTo(map)
      })
      function getPopupHTML(dhbName) {
        var { active, deceased, last24Hours, recovered, total } = data[dhbName]
        return `<div style="font-family: 'Quicksand', sans-serif; background-color: transparent;">
                  <h3>${dhbName.toUpperCase()}</h3>
                  <table>
                    <tr style="color:#97AEDC">
                      <td>TOTAL CASES</td><td>${total}</td>
                    </tr>
                    <tr style="color:#E6ADB7">
                      <td>ACTIVE CASES</td><td>${active}</td>
                    </tr>
                    <tr style="color:#E3C567">
                      <td>NEW CASES (LAST 24 HOURS)</td><td>${last24Hours}</td>
                    </tr>
                    <tr style="color:#9BC995">
                      <td>RECOVERED</td><td>${recovered}</td>
                    </tr>
                    <tr style="color:#ED7F7D">
                      <td>DEAD</td><td>${deceased}</td>
                    </tr>
                  </table>
                </div>
                `
      }
    })
    this.map = map
  }

  componentWillUnmount() {
    this.map = null
    if (document.querySelector('.map-filters')) document.querySelector('.map-filter-box').removeChild(document.querySelector('.map-filters'))
  }

  toggleFilterBox = e => {
    if (document.querySelector('.toggle-container').classList.contains('down')) {
      document.querySelector('.toggle-container').classList.remove('down')
      document.querySelector('.toggle-container').classList.add('hidden')
    } else if (document.querySelector('.toggle-container').classList.contains('hidden')) {
      document.querySelector('.toggle-container').classList.add('down')
      document.querySelector('.toggle-container').classList.remove('hidden')
    }
  }

  render() {
    return (
      <div className="mapContainer"
           ref={el => this.mapContainer = el}
           style={{
             height: chartHeight,
             border: '1px solid #212121',
             boxSizing: 'border-box'
           }}>
        <div className="map-filter-box">
          <div className="toggle-container hidden" onClick={(e) => this.toggleFilterBox(e)}>
            <div className="toggle-filter-display"/>
            <p style={{margin: 0}}>SELECT DATA TO DISPLAY</p>
          </div>
        </div>
      </div>
    )
  }

}

export default Mapbox
