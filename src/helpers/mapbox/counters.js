import { showDHBNames } from './main-data'

const layerIds = [
  'districtHealthBoardName', 'districtHealthBoardName-label',
  'total', 'total-label',
  'active', 'active-label',
  'last24Hours', 'last24Hours-label',
  'recovered', 'recovered-label',
  'deceased', 'deceased-label'
]

// Removes layers based on given list of layers
function removeExistingDataLayers(map, layers) {
  layers.forEach(function(layer) {
    if (map.getLayer(layer)) map.removeLayer(layer)
  })
}

export function changeDisplayData(displayDataType, map, apiData, dhbList) {
  // Remove any existing layers so that previous data is no longer shown
  removeExistingDataLayers(map, layerIds.filter(id => (id !== displayDataType || id !== `${displayDataType}-label`)))
  // Special case: DHB names is not a quantity, so just show names of DHBs
  if (displayDataType === 'districtHealthBoardName') showDHBNames(map, dhbList)
  // Else, for every other data, create circles with numbers showing case count
  else {
    var featuresArray = dhbList.filter(dhb => apiData[dhb.name][displayDataType] > 0).map(function(dhb) {
      var featureObject = {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [dhb.lng, dhb.lat]
        },
        'properties': {}
      }
      featureObject.properties[`${displayDataType}-count`] = apiData[dhb.name][displayDataType]
      return featureObject
    })
    map.getSource('points').setData({
      'type': 'FeatureCollection', 'features': featuresArray
    })
    // Show circles visualising recovered count in each DHB
    map.addLayer({
      'id': displayDataType,
      'type': 'circle',
      'source': 'points',
      'filter': ['has', `${displayDataType}-count`],
      'paint': {
        'circle-radius': [
          'step', ['get', `${displayDataType}-count`],
          10, 10,
          12.5, 20,
          15, 40,
          17.5, 60,
          20, 80,
          22.5, 100,
          25, 150,
          30, 200,
          35, 300,
          40
        ],
        'circle-opacity': 0.6,
        'circle-color': displayDataType === 'total' ? '#193366' :
                        displayDataType === 'active' ? '#E6ADB7' :
                        displayDataType === 'last24Hours' ? '#E3C567' :
                        displayDataType === 'recovered' ? '#9BC995' :
                        displayDataType === 'deceased' ? '#E85F5C' : 'black'
      }
    })
    // Numbers on top of circles
    map.addLayer({
      'id': `${displayDataType}-label`,
      'type': 'symbol',
      'source': 'points',
      'layout': {
        'text-field': ['get', `${displayDataType}-count`],
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12,
        'text-allow-overlap': true
      },
      'paint': {
        'text-color': 'white'
      }
    })
  }
}
