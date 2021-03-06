import { S3 } from "aws-sdk"
import { CreateMultipartUploadRequest, ObjectCannedACL, StorageClass } from "aws-sdk/clients/s3"
import { S3Options } from "electron-builder-http/out/publishOptions"
import { Arch, debug } from "builder-util"
import { PublishContext, Publisher } from "electron-publish"
import { ProgressCallback } from "electron-publish/out/progress"
import { ensureDir, stat, symlink } from "fs-extra-p"
import mime from "mime"
import * as path from "path"
import { S3Client, Uploader } from "./uploader"

export default class S3Publisher extends Publisher {
  readonly providerName = "S3"

  constructor(context: PublishContext, private readonly info: S3Options) {
    super(context)

    debug(`Creating S3 Publisher — bucket: ${info.bucket}`)
  }

  static async checkAndResolveOptions(options: S3Options, channelFromAppVersion: string | null) {
    const bucket = options.bucket
    if (bucket == null) {
      throw new Error(`Please specify "bucket" for "s3" update server`)
    }

    if (bucket.includes(".") && options.region == null) {
      // on dotted bucket names, we need to use a path-based endpoint URL. Path-based endpoint URLs need to include the region.
      const s3 = new S3({signatureVersion: "v4"});
      (options as any).region = (await s3.getBucketLocation({Bucket: bucket}).promise()).LocationConstraint
    }

    if (options.channel == null && channelFromAppVersion != null) {
      (options as any).channel = channelFromAppVersion
    }
  }

  // http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-creating-buckets.html
  async upload(file: string, arch: Arch, safeArtifactName?: string): Promise<any> {
    const fileName = path.basename(file)
    const fileStat = await stat(file)
    const client = new S3Client({s3Options: {signatureVersion: "v4"}})
    const cancellationToken = this.context.cancellationToken

    const target = (this.info.path == null ? "" : `${this.info.path}/`) + fileName

    if (process.env.__TEST_S3_PUBLISHER__ != null) {
      const testFile = path.join(process.env.__TEST_S3_PUBLISHER__!, target)
      await ensureDir(path.dirname(testFile))
      await symlink(file, testFile)
      return
    }

    const s3Options: CreateMultipartUploadRequest  = {
      Key: target,
      Bucket: this.info.bucket!,
      ContentType: mime.lookup(file)
    }

    // if explicitly set to null, do not add
    if (this.info.acl !== null) {
      s3Options.ACL = this.info.acl as ObjectCannedACL || "public-read"
    }
    if (this.info.storageClass != null) {
      s3Options.StorageClass = this.info.storageClass as StorageClass
    }

    const uploader = new Uploader(client, s3Options, file, fileStat)

    const progressBar = this.createProgressBar(fileName, fileStat)
    if (progressBar != null) {
      const callback = new ProgressCallback(progressBar)
      uploader.on("progress", () => {
        if (!cancellationToken.cancelled) {
          callback.update(uploader.loaded, uploader.contentLength)
        }
      })
    }

    return cancellationToken.createPromise((resolve, reject, onCancel) => {
      onCancel(() => uploader.abort())
      uploader.upload()
        .then(() => {
          try {
            debug(`S3 Publisher: ${fileName} was uploaded to ${this.info.bucket}`)
          }
          finally {
            resolve()
          }
        })
        .catch(reject)
    })
  }

  toString() {
    return `S3 (bucket: ${this.info.bucket})`
  }
}