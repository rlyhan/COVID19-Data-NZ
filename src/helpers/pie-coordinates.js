import { group } from './general-helpers'

function sortKeys(data) {
    return Object.keys(data).sort(function(a, b) {
        var firstKey = a.split(' ')[0]
        var secondKey = b.split(' ')[0]
        if (firstKey < secondKey) return -1
        if (secondKey < firstKey) return 1
        return 0
    })
}

/* Total Case Data */ 

export function getAgeGroupData(data, caseType) {
    var sortedKeys = sortKeys(data)
    return sortedKeys.map(dataKey => [dataKey, data[dataKey][caseType]])
}

export function getSexData(data) {
    var casesBySex = group(data, 'sex')
    return Object.keys(casesBySex).map(sex => [sex, casesBySex[sex].length])
}

export function getDHBData(data) {
    var casesByDHB = group(data, 'districtHealthBoard')
    return Object.keys(casesByDHB).map(dhb => [dhb, casesByDHB[dhb].length])
}

/* Testing Rate Data */ 

export function getTestingData(data, dataType) {
    return Object.keys(data).map(dhb => [dhb, data[dhb][dataType]])
}