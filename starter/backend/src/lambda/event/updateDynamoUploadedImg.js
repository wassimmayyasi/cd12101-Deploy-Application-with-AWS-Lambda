import { updateDynamoWithImageUrl } from '../../business-logic/todos.mjs';
import { createLogger } from '../../utils/logger.mjs';

const logger = createLogger('update_dynamo_with_uploaded_image');

export async function handler(event) {
    logger.info(`The update dynamo with uploaded image url handler just got fired, we're about to process the request: ${JSON.stringify(event)}`);
    try {
        logger.info(event);
        const record = event.Records[0];
        await updateDynamoWithImageUrl(record);
        logger.info(`Successfully updated todoId ${todoId} with attachmentUrl: ${publicUrl}`);
        return {
            statusCode: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            }
        }
    } catch (e) {
        return {
            statusCode: 404,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                error: e
            })
        };
    }
}

