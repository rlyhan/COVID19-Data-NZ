import React, { Component } from 'react'
import mapboxgl from 'mapbox-gl'
import { dhbList } from '../../helpers/general-data'
import { getRegularCaseString, camelToSpaceCase } from '../../helpers/general-helpers'
import { addDHBRegions, createPointsSource } from '../../helpers/mapbox/main-data'
import { changeDisplayData } from '../../helpers/mapbox/counters'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN

class Mapbox extends Component {

  constructor(props) {
    super(props)
    this.state = {
      lng: 172.515,
      lat: -41.206,
      zoom: 4.2,
      mapLoaded: false,
      displayDataName: 'total'
    }
  }

  componentDidMount() {
    var { data } = this.props
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/rlyhan/ck98cd91l3zpm1imxqvljfg9y',
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom,
      trackResize: true
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
      changeDisplayData(this.state.displayDataName, map, data, dhbList)
    })

    // Create filters
    var filterBox = document.querySelector('.map-filter-box')
    var filterWrapper = document.createElement('div')
    filterWrapper.className = 'map-filters-wrapper'
    filterBox.appendChild(filterWrapper)
    var filterList = document.createElement('div')
    filterList.className = 'map-filters'
    filterWrapper.appendChild(filterList)
    // var displayDataNames = ['districtHealthBoardName', 'total', 'active', 'last24Hours', 'recovered', 'deceased']
    var displayDataNames = ['districtHealthBoardName', 'total', 'active', 'recovered', 'deceased']
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
      radio.checked = this.state.displayDataName === displayData
      radio.onchange = function() {
        // Hide popup (if any)
        if (currentPopup) currentPopup.remove()
        // Uncheck other radio buttons
        document.querySelectorAll('input').forEach(radioBtn => radioBtn.checked = false)
        // Check this radio button
        radio.checked = true
        this.setState({ displayDataName: displayData })
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
        map.flyTo({ center: e.features[0].geometry.coordinates })
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
        map.flyTo({ center: coordinates })
        // Place a popup
        currentPopup = new mapboxgl.Popup({
          className: 'popup',
          anchor: (window.screen.width > 565) ? 'top' : 'center'
        })
          .setLngLat(coordinates)
          .setHTML(getPopupHTML(clickedDHB.name))
          .addTo(map)
      })
      function getPopupHTML(dhbName) {
        var { active, deceased, last24Hours, recovered, total } = data[dhbName]
        return `<div style="padding: 5px; font-family: 'Quicksand', sans-serif; background-color: transparent;">
                  <table>
                    <tr><th>${dhbName.toUpperCase()}</th></tr>
                    <tr style="color:#97AEDC">
                      <td>TOTAL CASES</td><td><div><span>${total}</span></div></td>
                    </tr>
                    <tr style="color:#E6ADB7">
                      <td>ACTIVE CASES</td><td><div><span>${active}</span></div></td>
                    </tr>
                    <tr style="color:#9BC995">
                      <td>RECOVERED</td><td><div><span>${recovered}</span></div></td>
                    </tr>
                    <tr style="color:#ED7F7D">
                      <td>DEAD</td><td><div><span>${deceased}</span></div></td>
                    </tr>
                  </table>
                </div>
                `
      }
    })

    this.map = map
    window.addEventListener('resize', this.forceMapResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.forceMapResize)
    if (document.querySelector('.map-filters-wrapper')) document.querySelector('.map-filter-box').removeChild(document.querySelector('.map-filters-wrapper'))
    this.map.remove()
  }

  toggleFilterBox = e => {
    if (document.querySelector('.toggle-container').classList.contains('showing')) {
      document.querySelector('.toggle-container').classList.remove('showing')
      document.querySelector('.toggle-container').classList.add('hidden')
    } else if (document.querySelector('.toggle-container').classList.contains('hidden')) {
      document.querySelector('.toggle-container').classList.add('showing')
      document.querySelector('.toggle-container').classList.remove('hidden')
    }
  }

  forceMapResize = () => {
    if (this.map) {
      document.querySelector('.mapboxgl-canvas').style.width = `${window.screen.width*0.6}px`
      this.map.resize()
    }
  }

  render() {
    return (
      <div className="map-wrapper">
        <div className="mapContainer"
             ref={el => this.mapContainer = el}
             style={{
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
      </div>
    )
  }

}

export default Mapbox
