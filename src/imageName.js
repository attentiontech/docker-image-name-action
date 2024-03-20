/**
 * Generates a docker image
 * @param {string} baseName
 * @returns {string} The generated docker image name
 */
function generateDockerImageName(baseName) {
  const buildtime = new Date().toTimeString().replace(/:/g, '-')
  const tag =
    `${process.env.GITHUB_HEAD_REF}-time-${buildtime}-commit-${process.env.GITHUB_SHA}`.replace(
      /\//g,
      '-'
    )
  const imageName = `${baseName}:${tag}`
  return imageName
}

module.exports = { generateDockerImageName }
