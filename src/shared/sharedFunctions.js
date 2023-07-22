/** Remove ending zeros from array
 *
 */
function removeEndingZeros(arr) {
  while (arr[arr.length - 1] === 0) {
    // While the last element is a 0,
    arr.pop(); // Remove that last element
  }
  return arr;
}

/** Function that count occurrences of a substring in a string;
 * @param {String} string               The string
 * @param {String} subString            The sub string to search for
 */
function occurrences(string, substring) {
  let re = new RegExp(substring, "g");
  return ((string + "").match(re) || []).length;
}
