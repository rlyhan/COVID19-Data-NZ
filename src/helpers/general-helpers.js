// Formats every word starting with uppercase letter and the following letters lowercase
export function getRegularCaseString(str) {
  if (str.split(" ").length === 1) return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  return str.split(" ")
    .map(str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase())
    .join(" ")
}

// Formats 'camelCase' to 'space case'
export const camelToSpaceCase = str => str.replace(/[A-Z]/g, letter => ` ${letter.toLowerCase()}`)

// Make count string with CASES/CASE/NO CASES + case type, depending on number
export const formatCount = (num, type) => {
  return (num > 1) ? `${num} ${type} CASES` :
         (num === 1) ? `${num} ${type} CASE` :
         `NO ${type} CASES`
}

// Add plus or minus in front of count string
export const formatCountIncrease = num => {
  if (Math.sign(num) === -1) return `${num.toLocaleString('en')} `
  else if (Math.sign(num) === 1) return `+${num.toLocaleString('en')} `
}

// Takes an array of objects and a key property of each object
// Returns object
export const group = (array, key) => {
  // Return the end result
  return array.reduce((result, currentValue) => {
    // If an array already present for key, push it to the array. Else create an array and push the object
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
      currentValue
    )
    // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
    return result
  }, {}) // empty object is the initial value for result object
}