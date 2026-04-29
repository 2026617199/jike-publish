import {
  setApiConfig,
  api,
  isSuccess,
  ApiOptions,
  ApiResponses,
  type ApiConfig,
} from 'jike-sdk'

const { PostType } = ApiOptions

export interface PublishConfig {
  /** Jike API endpoint ID */
  endpointId: string
  /** Jike API endpoint URL */
  endpointUrl: string
  /** App bundle ID */
  bundleId: string
  /** App version string */
  appVersion: string
  /** App build number */
  buildNo: string
  /** User-Agent header */
  userAgent: string
  /** Access token for authentication */
  accessToken: string
}

export interface PublishOptions {
  /** Topic (圈子) ID to post in */
  topicId?: string
  /** Image keys returned from upload API */
  pictureKeys?: string[]
  /** Sync to personal updates (default: true) */
  syncToPersonalUpdates?: boolean
}

export interface PublishResult {
  success: boolean
  /** Post ID when successful */
  postId?: string
  /** Error message when unsuccessful */
  error?: string
}

/**
 * Publish a post to Jike (即刻).
 *
 * @param config - API and authentication configuration
 * @param content - Text content of the post
 * @param options - Optional post settings (topic, images, etc.)
 * @returns Result with success flag and post ID or error message
 */
export async function publish(
  config: PublishConfig,
  content: string,
  options: PublishOptions = {},
): Promise<PublishResult> {
  const apiConfig: ApiConfig = {
    endpointId: config.endpointId,
    endpointUrl: config.endpointUrl,
    bundleId: config.bundleId,
    appVersion: config.appVersion,
    buildNo: config.buildNo,
    userAgent: config.userAgent,
    accessToken: config.accessToken,
  }

  setApiConfig(apiConfig)

  const response = await api.posts.create<ApiResponses.Posts.CreateResponse>(PostType.ORIGINAL, content, {
    topicId: options.topicId,
    pictureKeys: options.pictureKeys ?? [],
    syncToPersonalUpdates: options.syncToPersonalUpdates ?? true,
  })

  if (isSuccess(response)) {
    return { success: true, postId: response.data.data.id }
  }

  return {
    success: false,
    error: response.data.error ?? 'Unknown error',
  }
}
