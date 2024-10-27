import AWSXRay from 'aws-xray-sdk-core';
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createLogger } from '../utils/logger.mjs';

const logger = createLogger('s3_access');

export class S3Access {
    constructor() {
        this.bucket = process.env.S3_BUCKET_ATTACHMENTS;
        this.expirationTime = parseInt(process.env.EXPIRATION_FOR_PRESIGNED_URLS);
        this.s3Client = new S3Client();
        this.s3Client.middlewareStack.add(
            (next) => async (args) => {
                const segment = AWSXRay.getSegment()?.addNewSubsegment('S3Request');
                try {
                    const result = await next(args);
                    return result;
                } catch (error) {
                    if (segment) segment.addError(error);
                    throw error;
                } finally {
                    if (segment) segment.close();
                }
            },
            { step: "initialize" }
        );

    }
  
    async generatePresignedURLForUpload(todoId, userId) {
        logger.info("creating the command for putting object")
        const command = new PutObjectCommand({
            Bucket: this.bucket, 
            Key: `${userId}/${todoId}`
        })
        logger.info(`About to make the request to generate a signed url for user: ${userId} for their todo: ${todoId}`)
        try {
            const result =  await getSignedUrl(this.s3Client, command, {expiresIn: this.expirationTime});
            logger.info(`This is the result returned: ${result}`);
            return result
        } catch(err) {
            logger.error(`something went wrong: ${err}`)
        }
    }
}