import AWS = require('aws-sdk');
import { Book, MutationCreateBookArgs } from '../types/book';
import { AppSyncResolverHandler } from "aws-lambda";
import { addTodoItem, getAllTodos, deleteTodoItem } from './db';

const createResponse = (body: string | AWS.DynamoDB.DocumentClient.ItemList, statusCode = 200) => {
    return {
        statusCode,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS"
        },
        body: JSON.stringify(body, null, 2)
    }
}

export const appsynchandler_list: AppSyncResolverHandler<null, Book[] | null> = async () => {
    try {
        const response = await getAllTodos();
        return response.Items as Book[];
    } catch (err) {
        console.error("[Error] DynamoDB error: ", err);
        return null;
    }
};

export const appsynchandler_create: AppSyncResolverHandler<MutationCreateBookArgs, Book | null> = async (event) => {
    try {
        const book = event.arguments.book;
        const response = await addTodoItem(book);
        return response as Book;

    } catch (err) {
        console.error("[Error] DynamoDB error: ", err);
        return null;
    }
};

export const resthandler = async function (event: AWSLambda.APIGatewayEvent) {
    try {
        const { httpMethod, body: requestBody } = event;

        if (httpMethod === 'OPTIONS') {
            return createResponse("OK")
        }

        //
        if (httpMethod === 'GET') {
            const response = await getAllTodos();

            return createResponse(response.Items || []);
        }

        //
        if (!requestBody) {
            return createResponse("Missing request body", 500);
        }
        const data = JSON.parse(requestBody);
        if (httpMethod === "POST") {
            const todo = await addTodoItem(data);
            return todo
                ? createResponse(`${todo} added to the database`)
                : createResponse("Todo is missing", 500);
        }
        if (httpMethod === "DELETE") {
            const id = await deleteTodoItem(data);
            return id
                ? createResponse(
                    `Todo item with an id of ${id} deleted from the database`
                )
                : createResponse("ID is missing", 500);
        }

        //
        return createResponse(`We only accept GET, POST requests for now, not ${httpMethod}`)
    } catch (error) {
        console.log(error)
        return createResponse('error', 500);
    }
}