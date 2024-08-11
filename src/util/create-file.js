const fs = require('fs')
const {
  DIR_EMAIL_TEMPLATE,
  DIR_EMAIL_FRAGMENT,
  PATH_BOILERPLATE_EMAIL_TEMPLATE,
  PATH_BOILERPLATE_EMAIL_FRAGMENT,
} = require('./boilerplate')

/**
 * Creates the HTML file for the Veeva RTE project.
 *
 * @returns {void}
 */
const createRTEFile = async (params) => {}

/**
 * Creates email templates from an array of file names.
 *
 * @param {{name: String, emailTemplateNames: Array<String>}} params
 * @returns {void}
 */
const createEmailTemplates = async (params) => {
  const { name, emailTemplateNames } = params
  const promises = []

  // Create directory for email templates.
  await fs.mkdirSync(`${name}/${DIR_EMAIL_TEMPLATE}`)

  // Create email template files.
  emailTemplateNames.forEach(async (templateName) => {
    promises.push(
      await new Promise(async (resolve) => {
        await fs.mkdirSync(`${name}/${DIR_EMAIL_TEMPLATE}/${templateName}`)
        await fs.copyFile(
          `${PATH_BOILERPLATE_EMAIL_TEMPLATE}`,
          `./${name}/${DIR_EMAIL_TEMPLATE}/${templateName}/index.html`,
          (err) => {
            if (err) throw err
          }
        )
        resolve()
      })
    )
  })

  return new Promise(async (resolve) => {
    await Promise.all(promises)
    resolve()
  })
}

/**
 * Creates email fragments from an array of file names.
 *
 * @param {{name: String, emailFragmentNames: Array<String>}} params
 * @returns {void}
 */
const createEmailFragments = async (params) => {
  const { name, emailFragmentNames } = params
  const promises = []

  // If no email fragments were defined by the user.
  if (emailFragmentNames.length === 0) {
    return new Promise((resolve) => {
      resolve()
    })
  }

  // Create directory for email fragments.
  await fs.mkdirSync(`${name}/${DIR_EMAIL_FRAGMENT}`)

  // Create email fragment files.
  emailFragmentNames.forEach(async (fragmentName) => {
    promises.push(
      await new Promise(async (resolve) => {
        await fs.mkdirSync(`${name}/${DIR_EMAIL_FRAGMENT}/${fragmentName}`)
        await fs.copyFile(
          `${PATH_BOILERPLATE_EMAIL_FRAGMENT}`,
          `./${name}/${DIR_EMAIL_FRAGMENT}/${fragmentName}/index.html`,
          (err) => {
            if (err) throw err
          }
        )
        resolve()
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
