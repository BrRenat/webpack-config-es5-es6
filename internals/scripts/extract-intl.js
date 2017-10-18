
/* eslint-disable */
/**
 * This script will extract the internationalization messages from all components
 and package them in the translation json files in the translations file.
 */
import fs from 'fs'
import nodeGlob from 'glob'
import { transform } from 'babel-core'

import animateProgress from './helpers/progress'
import addCheckmark from './helpers/checkmark'

const DEFAULT_LOCALE = 'ru'

require('shelljs/global')

// Glob to match all js files except i18n translations
const FILES_TO_PARSE = 'src/**/messages.js'

const newLine = () => process.stdout.write('\n');

// Progress Logger
let progress;
const task = (message) => {
  progress = animateProgress(message)
  process.stdout.write(message)

  return (error) => {
    if (error) {
      process.stderr.write(error)
    }
    clearTimeout(progress)
    return addCheckmark(() => newLine())
  }
}

// Wrap async functions below into a promise
const glob = (pattern) => new Promise((resolve, reject) => {
  nodeGlob(pattern, (error, value) =>
    error
      ? reject(error)
      : resolve(value)
  )
})
const readFile = (fileName) => new Promise((resolve, reject) => {
  fs.readFile(fileName, (error, value) =>
    error
      ? reject(error)
      : resolve(value)
  )
})
const writeFile = (fileName, data) => new Promise((resolve, reject) => {
  fs.writeFile(fileName, data, (error, value) =>
    error
      ? reject(error)
      : resolve(value)
  )
})

// Store existing translations into memory
let localeMappings = []

const extractFromFile = async (fileName) => {
  try {
    const code = await readFile(fileName)

    // Use babel plugin to extract instances where react-intl is used
    const { metadata: result } = await transform(code, {
      presets: [
        "react",
        "stage-0",
      ],
      plugins: [
        ['react-intl'],
      ],
    })

    // extract array of messages for each file
    const messages = result['react-intl'].messages

    messages.map(msg =>
      localeMappings = [...localeMappings, {
        id: msg.id,
        message: msg.defaultMessage,
      }]
    )
  } catch (error) {
    process.stderr.write(`Error transforming file: ${fileName}\n${error}`)
  }
}

(async function main() {
  const memoryTaskDone = task('Storing language files in memory')
  const files = await glob(FILES_TO_PARSE);
  memoryTaskDone()

  const extractTaskDone = task('Run extraction on all files')
  // Run extraction on all files that match the glob on line 16
  await Promise.all(files.map((fileName) => extractFromFile(fileName)))
  extractTaskDone()

  // Make the directory if it doesn't exist, especially for first run
  mkdir('-p', 'src/translations')

  const translationFileName = `src/translations/${DEFAULT_LOCALE}.json`

  const localeTaskDone = task(
    `Writing translation messages for ${DEFAULT_LOCALE} to: ${translationFileName}`
  );

  try {
    // Sort the translation JSON file, create array of translations
    // consisting from { messageId: message }
    let messages = localeMappings
      .sort((a, b) => {
        a = a.id.toUpperCase()
        b = b.id.toUpperCase()

        if (a < b) return -1
        if (a > b) return 1
        return 0
      })
      .reduce((acc, curr) =>
        ({ ...acc, [curr.id]: curr.message })
      , {})

    // Write to file the JSON representation of the translation messages
    const prettified = `${JSON.stringify(messages, null, 2)}\n`

    await writeFile(translationFileName, prettified)

    localeTaskDone()
  } catch (error) {
    localeTaskDone(
      `There was an error saving this translation file: ${translationFileName}
        \n${error}`
    )
  }

  process.exit()
}())
