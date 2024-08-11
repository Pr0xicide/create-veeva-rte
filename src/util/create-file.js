const fs = require('fs')
const {
  DIR_EMAIL_TEMPLATE,
  DIR_EMAIL_FRAGMENT,
  PATH_BOILERPLATE_EMAIL_TEMPLATE,
  PATH_BOILERPLATE_EMAIL_FRAGMENT,
} = require('./boilerplate')
const { FILE_TYPES } = require('./file-types')

/**
 * Creates the HTML file for the Veeva RTE project.
 *
 * @param {Object{directory: String, fileName: String, fileType: FILE_TYPES}} params
 * @returns {void}
 */
const createRTEFile = (params) => {
  const { directory, fileName, fileType } = params
  let subDir, boilerplateFile

  return new Promise(async (resolve) => {
    switch (fileType) {
      case FILE_TYPES.EMAIL_TEMPLATE:
        subDir = `${DIR_EMAIL_TEMPLATE}`
        boilerplateFile = `${PATH_BOILERPLATE_EMAIL_TEMPLATE}`
        break
      case FILE_TYPES.EMAIL_FRAGMENT:
        subDir = `${DIR_EMAIL_FRAGMENT}`
        boilerplateFile = `${PATH_BOILERPLATE_EMAIL_FRAGMENT}`
        break
    }

    // Create directory for file.
    await fs.mkdirSync(`${directory}/${subDir}/${fileName}`)

    // Copy and paste boilerplate file to directory.
    await fs.copyFile(
      `${boilerplateFile}`,
      `./${directory}/${subDir}/${fileName}/index.html`,
      (err) => {
        if (err) throw err
      }
    )

    resolve()
  })
}

/**
 * Create email templates from an array of file names.
 *
 * @param {{name: String, emailTemplateNames: Array<String>}} params
 * @returns {void}
 */
const createEmailTemplates = async (params) => {
  const { name, emailTemplateNames } = params
  const promises = []

  // Create email template files.
  emailTemplateNames.forEach(async (templateName) => {
    promises.push(
      createRTEFile({
        directory: name,
        fileName: templateName,
        fileType: FILE_TYPES.EMAIL_TEMPLATE,
      })
    )
  })

  return new Promise(async (resolve) => {
    await Promise.all(promises)
    resolve()
  })
}

/**
 * Create email fragments from an array of file names.
 *
 * @param {{name: String, emailFragmentNames: Array<String>}} params
 * @returns {void}
 */
const createEmailFragments = async (params) => {
  const { name, emailFragmentNames } = params
  const promises = []

  // Create email fragment files.
  emailFragmentNames.forEach(async (fragmentName) => {
    promises.push(
      createRTEFile({
        directory: name,
        fileName: fragmentName,
        fileType: FILE_TYPES.EMAIL_FRAGMENT,
      })
    )
  })

  return new Promise(async (resolve) => {
    await Promise.all(promises)
    resolve()
  })
}

module.exports = {
  createEmailFragments,
  createEmailTemplates,
}
