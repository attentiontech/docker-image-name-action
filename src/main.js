const core = require('@actions/core')
const { generateDockerImageName } = require('./imageName')

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
  try {
    const baseName = core.getInput('baseName', { required: true })
    core.debug('baseName', baseName)

    const imageName = generateDockerImageName(baseName)

    // Set outputs for other workflow steps to use
    core.setOutput('imageName', imageName)
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.setFailed(error.message)
  }
}

module.exports = {
  run
}
