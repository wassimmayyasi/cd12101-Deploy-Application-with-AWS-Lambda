import { updateTodo } from '../../business-logic/todos.mjs';
import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from '../utils.mjs';

const logger = createLogger('update_todo')

export async function handler(event) {
  logger.info(`The update handler was fired, we're about to process the request: ${JSON.stringify(event)}`)
    try {
      const todoId = event.pathParameters.todoId;
      const updatedTodo = JSON.parse(event.body);
      const userId = getUserId(event);

      const result = await updateTodo(todoId, updatedTodo, userId);
      return {
          statusCode: 204,
          headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true
          },
          body: JSON.stringify(result)
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
