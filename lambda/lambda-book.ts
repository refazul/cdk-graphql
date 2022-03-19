import AWS = require('aws-sdk');
import { Book, MutationCreateBookArgs, QueryGetBookByIdArgs } from '../types/book';
import { AppSyncResolverHandler } from "aws-lambda";
import { createItem, getItems, deleteTodoItem, getItemById } from './db';

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

export const appsynchandler_getBooks: AppSyncResolverHandler<null, Book[] | null> = async () => {
    try {
        const response = await getItems(process.env.TABLE_NAME || '');
        return response.Items as Book[];
    } catch (error) {
        console.error("[Error] DynamoDB error: ", error);
        return null;
    }
};

export const appsynchandler_getBookById: AppSyncResolverHandler<QueryGetBookByIdArgs, Book | null> = async (event) => {
    try {
        const bookId = event.arguments.bookId;
        const response = await getItemById(bookId, process.env.TABLE_NAME || '');
        return response as Book;
    } catch (error) {
        console.error("[Error] DynamoDB error: ", error);
        return null;
    }
}

export const appsynchandler_createBook: AppSyncResolverHandler<MutationCreateBookArgs, Book | null> = async (event) => {
    try {
        const book = event.arguments.book;
        const response = await createItem(book, process.env.TABLE_NAME || '');
        return response as Book;
    } catch (error) {
        console.error("[Error] DynamoDB error: ", error);
        return null;
    }
};

export const resthandler_book = async function (event: AWSLambda.APIGatewayEvent) {
    try {
        const { httpMethod, body: requestBody } = event;

        if (httpMethod === 'OPTIONS') {
            return createResponse("OK")
        }
        if (httpMethod === 'GET') {
            const response = await getItems(process.env.TABLE_NAME || '');
            return createResponse(response.Items || []);
        }

        if (!requestBody) {
            return createResponse("Missing request body", 500);
        }
        const data = JSON.parse(requestBody);
        if (httpMethod === "POST") {
            const todo = await createItem(data, process.env.TABLE_NAME || '');
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

        return createResponse(`We only accept GET, POST requests for now, not ${httpMethod}`)
    } catch (error) {
        console.log(error)
        return createResponse('error', 500);
    }
}