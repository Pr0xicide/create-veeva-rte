const fs = require('fs')
const {
  PATH_BOILERPLATE_EMAIL_TEMPLATE,
  PATH_BOILERPLATE_EMAIL_FRAGMENT,
} = require('../util/boilerplate')
const { isValidFilename } = require('../validate/filename')

const RTE_PROJECT = {
  name: '',
  fragmentNames: [],
  numberFragments: 0,
}

let rl, logger

const createRTEProject = async (params) => {
  rl = params.rl
  logger = params.logger

  await defineProjectDirectory()
  await defineEmailFragments()
  await setupRTEProject()

  rl.close()
  process.exit(0)
}

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

const defineEmailFragments = async () => {
  return new Promise(async (resolve) => {
    await new Promise((resolve) => {
      rl.question('Number of fragments: ', (fragmentAmount) => {
        // Validate user response.
        if (isNaN(fragmentAmount)) {
          logger.error(`Expecting a number value for the number of fragments.`)
          process.exit(1)
        } else if (fragmentAmount < 0) {
          logger.error(`Number of fragment(s) value cannot be less than 0.`)
          process.exit(1)
        }

        RTE_PROJECT.numberFragments = fragmentAmount
        resolve()
      })
    })

    const fragmentPromises = []
    for (let i = 0; i < RTE_PROJECT.numberFragments; i++) {
      fragmentPromises.push(
        await new Promise((resolve) => {
          rl.question(`Fragment ${i + 1} name: `, (fragmentName) => {
            if (!isValidFilename(fragmentName)) {
              logger.error(
                `Cannot create fragment "${fragmentName}" as it contains either special characters or has reserved names.`
              )
              process.exit(1)
            }

            RTE_PROJECT.fragmentNames.push(fragmentName)
            resolve()
          })
        })
      )
    }
    await Promise.all(fragmentPromises)

    resolve()
  })
}

const setupRTEProject = async () => {
  const { name, numberFragments, fragmentNames } = RTE_PROJECT

  return new Promise(async (resolve) => {
    try {
      await fs.mkdirSync(`${name}`)

      // Email template.
      await fs.mkdirSync(`${name}/template`)
      await fs.copyFile(
        `${PATH_BOILERPLATE_EMAIL_TEMPLATE}`,
        `./${name}/template/index.html`,
        (err) => {
          if (err) throw err
        }
      )

      // Email fragment(s).
      if (numberFragments > 0) {
        await fs.mkdirSync(`${name}/fragments`)

        const fragmentDirectories = []
        fragmentNames.forEach((fragmentName) => {
          return new Promise(async (resolve) => {
            await fs.mkdirSync(`${name}/fragments/${fragmentName}`)
            await fs.copyFile(
              `${PATH_BOILERPLATE_EMAIL_FRAGMENT}`,
              `./${name}/fragments/${fragmentName}/index.html`,
              (err) => {
                if (err) throw err
              }
            )
            resolve()
          })
        })
        await Promise.all(fragmentDirectories)
      }

      logger.info(`Created RTE boilerplate located at "${process.cwd()}"`)
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
