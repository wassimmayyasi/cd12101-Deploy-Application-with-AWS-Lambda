import { getAllTodos } from '../../business-logic/todos.mjs';
import { createLogger } from '../../utils/logger.mjs';
import { getUserId } from "../utils.mjs";

const logger = createLogger('get_todos');

export async function handler(event) {
    logger.info(`The getTodos handler was fired, we're about to process the request: ${JSON.stringify(event)}`);
    try {
        const userId = getUserId(event);
        const result = await getAllTodos(userId);
    
        logger.info(`Got a response from the todoaccess for all todos for user ${userId} with result: ${result}`);
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                items: result
            })
        };
    } catch (e){
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
