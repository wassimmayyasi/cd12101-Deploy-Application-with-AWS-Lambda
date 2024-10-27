import { generatePresignedURL } from '../../business-logic/todos.mjs';
import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from '../utils.mjs'

const logger = createLogger('generate_upload_url')

export async function handler(event) {
    logger.info(`The generateUploadUrl handler was fired, we're about to process the request: ${JSON.stringify(event)}`)
    try {
        const userId = getUserId(event);
        const todoId = event.pathParameters.todoId;

        const result = await generatePresignedURL(todoId, userId);

        return {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                uploadUrl: result
            })
        };
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

