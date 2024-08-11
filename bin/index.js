#!/usr/bin/env node
'use strict'

const readline = require('readline')
const { createLogger, format, transports } = require('winston')
const { Command } = require('commander')
const { createRTEProject } = require('../src/command/project')

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
const program = new Command()

program
  .name('create-veeva-rte')
  .description('CLI tool to quickly setup Veeva RTEs boilerplate files.')
  .version('0.2.0')

program
  .command('project')
  .description('creates a new Veeva RTE project directory')
  .action(() => {
    createRTEProject({
      rl,
      logger,
    })
  })

program
  .command('email-template')
  .description('creates an email template HTML file')

program
  .command('email-fragment')
  .description('creates an email fragment HTML file')

program.parse()
