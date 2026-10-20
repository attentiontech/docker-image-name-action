/**
 * Unit tests for src/imageName.js
 */
const github = require('@actions/github')
const {
  generateDockerImageName,
  fitTag,
  MAX_TAG_LENGTH
} = require('../src/imageName')

const SHA = 'a'.repeat(40)
const SUFFIX = `-time-2026-10-07T20-42-51-commit-${SHA}`

describe('fitTag', () => {
  it('keeps a short tag unchanged apart from sanitising', () => {
    expect(fitTag('feature/pl-1234', SUFFIX)).toBe(`feature-pl-1234${SUFFIX}`)
  })

  it('cuts the ref, not the suffix, when the tag would exceed the limit', () => {
    const ref = 'dependabot/npm_and_yarn/apps/backoffice/multi-9efecba56a'
    const tag = fitTag(ref, SUFFIX)
    expect(tag.length).toBe(MAX_TAG_LENGTH)
    expect(tag.endsWith(SUFFIX)).toBe(true)
    expect(tag.startsWith('dependabot-npm_and_yarn-apps-backoffice-')).toBe(
      true
    )
  })

  it('never starts a tag with a dot or dash', () => {
    expect(fitTag('.hidden/branch', SUFFIX)).toBe(`hidden-branch${SUFFIX}`)
    expect(fitTag('-leading', SUFFIX)).toBe(`leading${SUFFIX}`)
  })

  it('replaces characters Docker does not allow', () => {
    expect(fitTag('feat/ÄB C@1', SUFFIX)).toBe(`feat--B-C-1${SUFFIX}`)
  })
})

describe('generateDockerImageName', () => {
  const originalRef = process.env.GITHUB_HEAD_REF

  afterEach(() => {
    if (originalRef === undefined) {
      delete process.env.GITHUB_HEAD_REF
    } else {
      process.env.GITHUB_HEAD_REF = originalRef
    }
  })

  it('produces a tag that fits Docker for a long dependabot branch', () => {
    process.env.GITHUB_HEAD_REF =
      'dependabot/npm_and_yarn/apps/backoffice/runtime-minor-patch-5450bd9271'
    jest.replaceProperty(github.context, 'sha', SHA)
    const { imageName, tag } = generateDockerImageName('registry/repo')
    expect(tag.length).toBeLessThanOrEqual(MAX_TAG_LENGTH)
    expect(tag).toMatch(new RegExp(`-commit-${SHA}$`))
    expect(imageName).toBe(`registry/repo:${tag}`)
  })

  it('leaves a normal branch tag intact', () => {
    process.env.GITHUB_HEAD_REF = 'feature/pl-3883'
    jest.replaceProperty(github.context, 'sha', SHA)
    const { tag } = generateDockerImageName('registry/repo')
    expect(tag).toMatch(
      new RegExp(
        `^feature-pl-3883-time-\\d{4}-\\d{2}-\\d{2}T\\d{2}-\\d{2}-\\d{2}-commit-${SHA}$`
      )
    )
  })
})
