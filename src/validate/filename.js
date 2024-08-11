/**
 * Checks if a given string is a valid file/folder name for both Windows and macOS.
 *
 * @param {string} folderName file/folder name to validate.
 * @returns {boolean} returns `true` if the file/folder name is valid, `false` otherwise.
 */
const isValidFilename = (folderName) => {
  // Define invalid characters for Windows
  const windowsInvalidChars = /[<>:"\/\\|?*]/

  // Define reserved names in Windows
  const windowsReservedNames = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i

  // Define invalid characters for macOS (colon ':')
  const macInvalidChars = /[:]/

  // Check for empty or whitespace-only folder name
  if (!folderName || folderName.trim() === '') {
    return false
  }

  // Check Windows invalid characters and reserved names
  if (
    windowsInvalidChars.test(folderName) ||
    windowsReservedNames.test(folderName)
  ) {
    return false
  }

  // Check macOS invalid characters
  if (macInvalidChars.test(folderName)) {
    return false
  }

  return true
}

module.exports = {
  isValidFilename,
}
