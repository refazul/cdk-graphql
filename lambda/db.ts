import AWS = require('aws-sdk');
import { v4 as uuid } from 'uuid';
import { Book } from '../types/book';

const tableName = process.env.TABLE_NAME || "";
const dynamo = new AWS.DynamoDB.DocumentClient();

export const getAllTodos = async () => {
    const scanResult = await dynamo.scan({ TableName: tableName }).promise();
    return scanResult;
}
export const addTodoItem = async (book: Book) => {
    const { id, ...rest } = book;
    await dynamo.put({
        TableName: tableName,
        Item: {
            id: id || uuid(),
            ...rest
        }
    }).promise();

    return book;
};
export const deleteTodoItem = async (data: { id: string }) => {
    const { id } = data;

    if (id && id !== "") {
        await dynamo
            .delete({
                TableName: tableName,
                Key: {
                    id
                }
            })
            .promise();
    }

    return id;
};