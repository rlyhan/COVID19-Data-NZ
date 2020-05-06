// Formats every word starting with uppercase letter and the following letters lowercase
export function getRegularCaseString(str) {
  if (str.split(" ").length === 1) return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  return str.split(" ")
    .map(str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase())
    .join(" ")
}
