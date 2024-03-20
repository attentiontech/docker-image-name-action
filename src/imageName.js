import github from '@actions/github'
const context = github.context

/**
 * Generates a docker image
 * @param {string} baseName
 * @returns {string} The generated docker image name
 */
function generateDockerImageName(baseName) {
  // generate string from the current time in RFC3339 format without special characters
  const buildtime = new Date().toISOString().replace(/-:/g, '-')
  const tag = `${context.ref}-time-${buildtime}-commit-${context.sha}`.replace(
    /\//g,
    '-'
  )
  const imageName = `${baseName}:${tag}`
  return imageName
}

module.exports = { generateDockerImageName }
