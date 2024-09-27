const fs = require('fs')
const { PATH_BOILERPLATE_EMAIL_TEMPLATE } = require('../util/boilerplate')
const { isValidFilename } = require('../validate/filename')

/**
 * Command process to create a new Veeva email template HTML file.
 *
 * @param {{rl: readline, logger: createLogger, dirName: String}} params
 * @returns {void}
 */
const createEmailTemplate = async (params) => {
  const { dirName, rl, logger } = params

  // Validate directory name.
  if (!isValidFilename(dirName)) {
    logger.error(
      `Cannot create directory with name "${directoryName}", as it contains either special characters or has reserved names.`
    )
    rl.close()
    process.exit(1)
  }

  // Create directory.
  await fs.mkdirSync(`${process.cwd()}/${dirName}`)

  // Create email template HTML file.
  await fs.copyFile(
    `${PATH_BOILERPLATE_EMAIL_TEMPLATE}`,
    `./${dirName}/index.html`,
    (err) => {
      if (err) throw err
    }
  )

  logger.info(`Created Veeva email template "${dirName}"`)
  rl.close()
  process.exit(0)
}

module.exports = {
  createEmailTemplate,
}
