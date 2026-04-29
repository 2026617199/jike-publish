#!/usr/bin/env node
import { config as loadEnv } from 'dotenv'
import { publish, type PublishConfig } from './index.js'

loadEnv()

function getRequiredEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    console.error(`Error: environment variable ${name} is required.`)
    process.exit(1)
  }
  return value
}

function printUsage(): void {
  console.log(`
Usage: jike-publish <content> [options]

Publish a post to Jike (即刻).

Arguments:
  content         Text content of the post (required)

Options:
  --topic <id>    Post in a specific topic (圈子) by its ID
  --help          Show this help message

Environment Variables (required):
  JIKE_ENDPOINT_ID    API endpoint ID
  JIKE_ENDPOINT_URL   API endpoint URL
  JIKE_BUNDLE_ID      App bundle ID
  JIKE_APP_VERSION    App version string
  JIKE_BUILD_NO       App build number
  JIKE_USER_AGENT     User-Agent header
  JIKE_ACCESS_TOKEN   Access token for authentication

Example:
  JIKE_ACCESS_TOKEN=<token> jike-publish "Hello, Jike! 🎉"
  jike-publish "In this circle" --topic <topic-id>
`)
}

async function main(): Promise<void> {
  const args = process.argv.slice(2)

  if (args.includes('--help') || args.includes('-h')) {
    printUsage()
    process.exit(0)
  }

  const contentArg = args.find((a) => !a.startsWith('--'))
  if (!contentArg) {
    console.error('Error: post content is required.\n')
    printUsage()
    process.exit(1)
  }

  const topicIndex = args.indexOf('--topic')
  const topicId =
    topicIndex !== -1 && args[topicIndex + 1]
      ? args[topicIndex + 1]
      : undefined

  const publishConfig: PublishConfig = {
    endpointId: getRequiredEnv('JIKE_ENDPOINT_ID'),
    endpointUrl: getRequiredEnv('JIKE_ENDPOINT_URL'),
    bundleId: getRequiredEnv('JIKE_BUNDLE_ID'),
    appVersion: getRequiredEnv('JIKE_APP_VERSION'),
    buildNo: getRequiredEnv('JIKE_BUILD_NO'),
    userAgent: getRequiredEnv('JIKE_USER_AGENT'),
    accessToken: getRequiredEnv('JIKE_ACCESS_TOKEN'),
  }

  console.log('Publishing post to Jike…')

  const result = await publish(publishConfig, contentArg, { topicId })

  if (result.success) {
    console.log(`✅ Published successfully! Post ID: ${result.postId}`)
  } else {
    console.error(`❌ Failed to publish: ${result.error}`)
    process.exit(1)
  }
}

main().catch((err: unknown) => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
