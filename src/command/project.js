const fs = require('fs')
const { isValidFilename } = require('../validate/filename')
const {
  createEmailTemplates,
  createEmailFragments,
} = require('../util/create-file')

const RTE_PROJECT = {
  name: '',
  // Email templates
  emailTemplateNames: [],
  numberEmailTemplates: 0,
  // Email fragments
  emailFragmentNames: [],
  numberEmailFragments: 0,
}

let rl, logger

/**
 * Command process to create a new Veeva RTE project.
 *
 * @param {{rl: readline, logger: createLogger}} params
 * @returns {void}
 */
const createRTEProject = async (params) => {
  rl = params.rl
  logger = params.logger

  await defineProjectDirectory()
  await defineEmailTemplates()
  await defineEmailFragments()
  await setupRTEProject()

  logger.info(
    `Created Veeva RTE project "${RTE_PROJECT.name}" located at "${process.cwd()}"`
  )
  rl.close()
  process.exit(0)
}

/**
 * Prompt for project directory name.
 * @returns {void}
 */
const defineProjectDirectory = async () => {
  return new Promise((resolve) => {
    rl.question('RTE project directory name: ', (directoryName) => {
      try {
        if (!isValidFilename(directoryName)) {
          throw new Error(
            `Cannot create directory "${directoryName}" as it contains either special characters or has reserved names.`
          )
        } else if (fs.existsSync(directoryName)) {
          throw new Error(
            `Project folder "${directoryName}" already exists in "${process.cwd()}".`
          )
        }

        RTE_PROJECT.name = directoryName
        resolve()
      } catch (err) {
        logger.error(err)
        rl.close()
        process.exit(1)
      }
    })
  })
}

/**
 * Prompts the user for how many email templates need to be created.
 * @returns {void}
 */
const defineEmailTemplates = async () => {
  return new Promise(async (resolve) => {
    await new Promise((resolve) => {
      rl.question('Number of email templates: ', (ammount) => {
        // Validate user response.
        if (isNaN(ammount)) {
          logger.error(
            `Expecting a number value for the number of email templates.`
          )
          process.exit(1)
        } else if (ammount < 1) {
          logger.error(`Veeva RTE project requires at least 1 email template.`)
          process.exit(1)
        }

        RTE_PROJECT.numberEmailTemplates = ammount
        resolve()
      })
    })

    const emailTemplatePromises = []
    for (let i = 0; i < RTE_PROJECT.numberEmailTemplates; i++) {
      emailTemplatePromises.push(
        await new Promise((resolve) => {
          rl.question(`Enail template ${i + 1} name: `, (name) => {
            if (!isValidFilename(name)) {
              logger.error(
                `Cannot create email template "${name}" as it contains either special characters or has reserved names.`
              )
              process.exit(1)
            }

            RTE_PROJECT.emailTemplateNames.push(name)
            resolve()
          })
        })
      )
    }
    await Promise.all(emailTemplatePromises)

    resolve()
  })
}

/**
 * Prompts the user for how many email fragments need to be created.
 * @returns {void}
 */
const defineEmailFragments = async () => {
  return new Promise(async (resolve) => {
    await new Promise((resolve) => {
      rl.question('Number of email fragments: ', (ammount) => {
        // Validate user response.
        if (isNaN(ammount)) {
          logger.error(
            `Expecting a number value for the number of email fragments.`
          )
          process.exit(1)
        } else if (ammount < 0) {
          logger.error(
            `Number of email fragment(s) value cannot be less than 0.`
          )
          process.exit(1)
        }

        RTE_PROJECT.numberEmailFragments = ammount
        resolve()
      })
    })

    const emailFragmentsPromises = []
    for (let i = 0; i < RTE_PROJECT.numberEmailFragments; i++) {
      emailFragmentsPromises.push(
        await new Promise((resolve) => {
          rl.question(`Email fragment ${i + 1} name: `, (name) => {
            if (!isValidFilename(name)) {
              logger.error(
                `Cannot create email fragment "${name}" as it contains either special characters or has reserved names.`
              )
              process.exit(1)
            }

            RTE_PROJECT.emailFragmentNames.push(name)
            resolve()
          })
        })
      )
    }
    await Promise.all(emailFragmentsPromises)

    resolve()
  })
}

/**
 * Creates the directory strucuture for the RTE project after user input.
 * @returns {void}
 */
const setupRTEProject = async () => {
  const { name } = RTE_PROJECT

  return new Promise(async (resolve) => {
    try {
      await fs.mkdirSync(`${name}`)
      await createEmailTemplates(RTE_PROJECT)
      await createEmailFragments(RTE_PROJECT)

      resolve()
    } catch (err) {
      logger.error(err)
      rl.close()
      process.exit(1)
    }
  })
}

module.exports = {
  createRTEProject,
}
