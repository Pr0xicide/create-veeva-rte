const { isValidFilename } = require('../src/validate/filename')

test('should return true for a valid folder name', () => {
  expect(isValidFilename('validFolderName')).toBe(true)
})

test('should return false for an empty string', () => {
  expect(isValidFilename('')).toBe(false)
})

test('should return false for a folder name with only spaces', () => {
  expect(isValidFilename('   ')).toBe(false)
})

test('should return false for a folder name with Windows invalid characters', () => {
  expect(isValidFilename('invalid<name')).toBe(false)
  expect(isValidFilename('invalid>name')).toBe(false)
  expect(isValidFilename('invalid:name')).toBe(false)
  expect(isValidFilename('invalid"name')).toBe(false)
  expect(isValidFilename('invalid/name')).toBe(false)
  expect(isValidFilename('invalid\\name')).toBe(false)
  expect(isValidFilename('invalid|name')).toBe(false)
  expect(isValidFilename('invalid?name')).toBe(false)
  expect(isValidFilename('invalid*name')).toBe(false)
})

test('should return false for a folder name with Windows reserved names', () => {
  expect(isValidFilename('CON')).toBe(false)
  expect(isValidFilename('PRN')).toBe(false)
  expect(isValidFilename('AUX')).toBe(false)
  expect(isValidFilename('NUL')).toBe(false)
  expect(isValidFilename('COM1')).toBe(false)
  expect(isValidFilename('LPT1')).toBe(false)
})

test('should return true for a folder name that is similar to a reserved name but not exact', () => {
  expect(isValidFilename('CONfile')).toBe(true)
  expect(isValidFilename('COM10')).toBe(true)
  expect(isValidFilename('LPT10')).toBe(true)
})

test('should return false for a folder name with macOS invalid characters', () => {
  expect(isValidFilename('folder:name')).toBe(false)
})

test('should return true for a folder name with special characters that are allowed', () => {
  expect(isValidFilename('folder_name')).toBe(true)
  expect(isValidFilename('folder-name')).toBe(true)
  expect(isValidFilename('folder.name')).toBe(true)
  expect(isValidFilename('folder name')).toBe(true)
})

test('should return true for a folder name with numbers', () => {
  expect(isValidFilename('folder123')).toBe(true)
})

test('should return true for a folder name with a mix of uppercase and lowercase letters', () => {
  expect(isValidFilename('FolderName')).toBe(true)
})

test('should return true for a folder name with Unicode characters', () => {
  expect(isValidFilename('フォルダ名')).toBe(true)
  expect(isValidFilename('名字')).toBe(true)
  expect(isValidFilename('файл')).toBe(true)
})
