import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import AWSXRay from 'aws-xray-sdk-core';
import { createLogger } from '../utils/logger.mjs';

const logger = createLogger('todo_access');

export class TodoAccess {
    constructor(
        documentClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
        todosTable = process.env.TODOS_TABLE,
        dueDateIndexTable = process.env.DUE_DATE_INDEX,
        tableIndexByUser = process.env.USER_TODOS_INDEX
    ) {
        this.documentClient = documentClient;
        this.todosTable = todosTable;
        this.dynamoDbClient = DynamoDBDocument.from(this.documentClient);
        this.dueDateIndexTable = dueDateIndexTable;
        this.tableIndexByUser = tableIndexByUser;
    }

    async addTodo(todoItem) {
        logger.info(`we're about to add a new todo to our todo dynamo table for user ${todoItem.userId}`);
        await this.dynamoDbClient.put({
            TableName: this.todosTable,
            Item: todoItem
        });
        return todoItem;
    }

    
    async getAllUserTodos(userId) {
        logger.info("We're about to fetch all todos for a particular user from the dynamo todos table");
        const result = await this.dynamoDbClient.query({
            TableName: this.todosTable,
            IndexName: this.tableIndexByUser,
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId" : userId
            }
        });

        return result.Items;
    }

    async getSortedTodosByDueDate(userId) {
        logger.info("We're about to fetch all todos for a particular user with due date sorted (ascending)");
        const result = await this.dynamoDbClient.query({
            TableName: this.todosTable,
            IndexName: this.dueDateIndexTable,
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId" : userId
            }
        });
        return result.Items;

    }

    async updateTodo(todoId, updatedTodo, userId) {
        logger.info(`We're setting up the params for the update call`)
        let params = {
            TableName: this.todosTable,
            Key: {
                userId: userId,
                todoId: todoId
            },
            ExpressionAttributeNames: {
                "#todoName": "name"
            },
            UpdateExpression: "SET #todoName = :name, dueDate = :dueDate, done = :done",
            ExpressionAttributeValues: {
                ":name": updatedTodo.name,
                ":dueDate": updatedTodo.dueDate,
                ":done": updatedTodo.done
            }
        };
        logger.info(`We're about to update a todo: ${todoId} for user: ${userId}`);
        const result = await this.dynamoDbClient.update(params);
        logger.info(`update todo, result: ${result}`);
        return {};
    }

    async deleteTodo(todoId, userId) {
        logger.info(`We're about to delete the todo: ${todoId} for user: ${userId}`);
        const result = await this.dynamoDbClient.delete({
            TableName: this.todosTable,
            Key: {
                todoId: todoId,
                userId: userId
            }
        });
        logger.info(`Delete completed, returned this: ${result}`);
        return result;
    }

    async updateAttachmentUrl(todoId, userId, url) {
        logger.info(`We're setting up the params for the update call`)
        const params = {
            TableName: this.todosTable,
            Key: {
                userId: userId,
                todoId: todoId
            },
            UpdateExpression: 'SET attachmentUrl = :url',
            ExpressionAttributeValues: {
                ':url': url
            }
        };
        logger.info(`We're about to update a todo: ${todoId} for user: ${userId} with the attachmentUrl: ${url}`);
        const result = await this.dynamoDbClient.update(params);
        logger.info(`Updating the attachment URL returned: ${JSON.stringify(result)}`)
        return {}
    }
}