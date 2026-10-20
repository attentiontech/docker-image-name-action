const github = require('@actions/github')

const { context } = github

// Docker tags: at most 128 characters, [A-Za-z0-9_.-], not starting with
// '.' or '-'. The "-time-<ts>-commit-<sha>" suffix is fixed width and other
// tooling matches on "-commit-<sha40>$", so the ref is what gets cut.
const MAX_TAG_LENGTH = 128

/**
 * Fits a tag into Docker's limits without touching its suffix.
 * @param {string} ref The branch or ref name
 * @param {string} suffix The fixed "-time-...-commit-..." part
 * @returns {string} A valid tag of at most MAX_TAG_LENGTH characters
 */
function fitTag(ref, suffix) {
  const safeRef = ref.replace(/[^A-Za-z0-9_.-]/g, '-').replace(/^[.-]+/, '')
  const budget = Math.max(0, MAX_TAG_LENGTH - suffix.length)
  return `${safeRef.slice(0, budget)}${suffix}`
}

/**
 * Generates a docker image
 * @param {string} baseName
 * @returns {object} The generated docker image name and tag
 */
function generateDockerImageName(baseName) {
  const refName = String(process.env.GITHUB_HEAD_REF || context.ref || '')
  // generate string from the current time in RFC3339 format without special characters
  const buildtime = new Date().toISOString().replace(/[-:.]/g, '-').slice(0, -5)
  const tag = fitTag(refName, `-time-${buildtime}-commit-${context.sha}`)
  const imageName = `${baseName}:${tag}`
  return {
    imageName,
    tag
  }
}

module.exports = { generateDockerImageName, fitTag, MAX_TAG_LENGTH }
