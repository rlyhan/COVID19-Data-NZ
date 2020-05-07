// Formats every word starting with uppercase letter and the following letters lowercase
export function getRegularCaseString(str) {
  if (str.split(" ").length === 1) return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  return str.split(" ")
    .map(str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase())
    .join(" ")
}

// Formats 'camelCase' to 'space case'
export const camelToSpaceCase = str => str.replace(/[A-Z]/g, letter => ` ${letter.toLowerCase()}`)
