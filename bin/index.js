#!/usr/bin/env node
'use strict'

const fs = require('fs')
const readline = require('readline')
const { createLogger, format, transports } = require('winston')
const { Command } = require('commander')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})
const logger = createLogger({
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
  },
  format: format.cli(),
  transports: [new transports.Console()],
})
const RTE_PROJECT = {
  name: '',
  fragmentNames: [],
  numberFragments: 0,
}

const program = new Command()
const args = process.argv
const PATH_BOILERPLATE_EMAIL_TEMPLATE = `${__dirname}/../boilerplate/email-template/index.html`
const PATH_BOILERPLATE_EMAIL_FRAGMENT = `${__dirname}/../boilerplate/email-fragment/index.html`

const createRTEProject = async () => {
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
        if (fs.existsSync(directoryName)) {
          logger.error(
            `Project folder "${directoryName}" already exists in "${process.cwd()}".`
          )
          process.exit(1)
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
          logger.error(`Expecting a number value for number of fragments.`)
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
            // TODO: Validate fragment name.
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

program
  .name('create-veeva-rte')
  .description('CLI tool to quickly setup Veeva RTEs boilerplate files.')
  .version('0.2.0')

program
  .command('project')
  .description('creates a new Veeva RTE project directory')
  .action(createRTEProject)

program
  .command('email-template')
  .description('creates an email template HTML file')

program
  .command('email-fragment')
  .description('creates an email fragment HTML file')

program.parse()
