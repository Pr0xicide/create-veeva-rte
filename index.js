#!/usr/bin/env node
'use strict'

const fs = require('fs')
const readline = require('readline')
const { createLogger, format, transports } = require('winston')


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
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
const PATH_BOILERPLATE_EMAIL_TEMPLATE = `${__dirname}/boilerplate/email-template/index.html`
const PATH_BOILERPLATE_EMAIL_FRAGMENT = `${__dirname}/boilerplate/email-fragment/index.html`
const RTE_PROJECT = {
  name: '',
  fragmentNames: [],
  numberFragments: 0,
}

const main = async (args) => {
  await defineProjectDirectory(args)
  await defineEmailFragments()
  await setupRTEProject()
}

const defineProjectDirectory = (args) => {
  
  if (args.length <= 2) {
    logger.error(`Missing parameter, project directory name. \n\t Example: create-veeva-rte rte-folder-name`)
    process.exit(1)
  }

  const projectName = args[2]
  
  return new Promise((resolve) => {
    try {
      if (fs.existsSync(projectName)) {
        logger.error(`Project folder "${projectName}" already exists in "${process.cwd()}".`)
        process.exit(1)
      }
  
      RTE_PROJECT.name = projectName
      resolve()
    } 
    
    catch (err) {
      logger.error(err);
      process.exit(1)
    }  
  })

}

const defineEmailFragments = async () => {
  return new Promise(async (resolve) => {
    await new Promise(resolve => {
      rl.question('Number of fragments: ', (fragmentAmount) => {
        // Validate user response.
        if (isNaN(fragmentAmount)) {
          logger.error(`Expecting a number value for number of fragments.`)
          process.exit(1)
        } 
        
        else if (fragmentAmount < 0) {
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
        await new Promise(resolve => {
          rl.question(`Fragment ${i + 1} name: `, (fragmentName) => {
            // TODO: Validate fragment name.
            RTE_PROJECT.fragmentNames.push(fragmentName)
            resolve()
          })      
        })      
      )
    }
    await Promise.all(fragmentPromises)
  
    rl.close()
    resolve()
  })
}

const setupRTEProject = async () => {
  const {name, numberFragments, fragmentNames} = RTE_PROJECT

  try {
    await fs.mkdirSync(`${name}`)
  
    // Email template.
    await fs.mkdirSync(`${name}/template`)
    await fs.copyFile(`${PATH_BOILERPLATE_EMAIL_TEMPLATE}`, `./${name}/template/index.html`, (err) => {
      if (err) throw err
    })
    
    // Email fragment(s).
    if (numberFragments > 0) {
      await fs.mkdirSync(`${name}/fragments`)

      const fragmentDirectories = []
      fragmentNames.forEach((fragmentName) => {
        return new Promise(async (resolve) => {
          await fs.mkdirSync(`${name}/fragments/${fragmentName}`)
          await fs.copyFile(`${PATH_BOILERPLATE_EMAIL_FRAGMENT}`, `./${name}/fragments/${fragmentName}/index.html`, (err) => {
            if (err) throw err
          })
          resolve()
        })   
      })
      await Promise.all(fragmentDirectories)
    }

    logger.info(`Created RTE boilerplate located at "${process.cwd()}"`)
    process.exit(0)
  }
  
  catch (err) {
    logger.error(err)
    process.exit(1)
  }

}

console.log(__dirname)
main(process.argv)