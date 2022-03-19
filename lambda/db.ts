import AWS = require('aws-sdk');
import { v4 as uuid } from 'uuid';

const tableName = process.env.TABLE_NAME || "";
const dynamo = new AWS.DynamoDB.DocumentClient();

export const getItems = async (table: string) => {
    const Items = await dynamo.scan({
        TableName: table
    }).promise();
    return Items;
}
export const getItemById = async (id: string, table: string) => {
    const { Item } = await dynamo.get({
        TableName: table,
        Key: {
            id
        }
    }).promise();
    return Item;
}
export const createItem = async (item: Object, table: string) => {
    const id = uuid();
    await dynamo.put({
        TableName: tableName,
        Item: {
            ...item,
            id
        }
    }).promise();
    const Item = await getItemById(id, table);
    return Item;
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