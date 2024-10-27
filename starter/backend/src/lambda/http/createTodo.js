import { createTodo } from "../../business-logic/todos.mjs";
import { getUserId } from "../utils.mjs";
import { createLogger } from '../../utils/logger.mjs';

const logger = createLogger('create_todo');

export async function handler(event) {
    logger.info(`The create todo handler just got fired, we're about to process the request: ${JSON.stringify(event)}`);
    try {
        const userId = getUserId(event);
        const newTodo = JSON.parse(event.body);

        const result = await createTodo(newTodo, userId);
        logger.info(`The returned response from creating the todo was ${result}`)
        return {
          statusCode: 201,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Content-Type': "application/json"
          },
          body: JSON.stringify({item: {
            ...result
          }})
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

