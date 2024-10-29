import { S3Access } from "../data-layer/s3Access.mjs";
import { TodoAccess } from "../data-layer/todoAccess.mjs";
import * as uuid from "uuid";

const todoAccess = new TodoAccess();
const s3Access = new S3Access();

export async function getAllTodos(userId) {
    return await todoAccess.getAllUserTodos(userId);
}

export async function getSortedTodosByDueDate(userId) {
    return await todoAccess.getSortedTodosByDueDate(userId);
}

export async function createTodo(todo, userId) {
    const todoId = uuid.v4();
    const done = false;
    const createdAt = new Date().toISOString();

    return await todoAccess.addTodo({
        ...todo,
        userId: userId,
        todoId: todoId,
        done: done,
        createdAt: createdAt
    });
}

export async function updateTodo(todoId, updatedTodo, userId) {
    return await todoAccess.updateTodo(todoId, updatedTodo, userId);
}

export async function deleteTodo(todoId, userId) {
    return await todoAccess.deleteTodo(todoId, userId);
}

export async function generatePresignedURL(todoId, userId) {
    return await s3Access.generatePresignedURLForUpload(todoId, userId)
}

export async function updateDynamoWithImageUrl(record) {
    const bucketName = record.s3.bucket.name;
    const objectKey = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));

    const [userId, todoId] = objectKey.split('/');

    const publicUrl = `https://${bucketName}.s3.amazonaws.com/${objectKey}`;

    return todoAccess.updateAttachmentUrl(todoId, userId, publicUrl);
}