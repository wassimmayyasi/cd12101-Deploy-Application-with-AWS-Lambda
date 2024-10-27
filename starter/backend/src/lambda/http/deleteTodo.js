import { deleteTodo } from '../../business-logic/todos.mjs';
import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from '../utils.mjs';

const logger = createLogger('delete_todo')

export async function handler(event) {
    logger.info(`The delete todo handler was fired, we're about to process the request ${JSON.stringify(event)}`);
    try {
        const todoId = event.pathParameters.todoId
        const userId = getUserId(event);
        const result = await deleteTodo(todoId, userId);
        logger.info(`This is the result I got, should be empty obj: ${result}`)
        return {
          statusCode: 204,
          headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true
          },
          body: JSON.stringify(result)
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
        } 
    }
}
