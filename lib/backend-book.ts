import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';

export class BackendBook extends cdk.Construct {
    public readonly resthandler_book: lambda.Function;
    public readonly appsynchandler_getBooks: lambda.Function;
    public readonly appsynchandler_createBook: lambda.Function;
    public readonly appsynchandler_getBookById: lambda.Function;

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id);

        const table_book = new dynamodb.Table(this, "table_book", {
            partitionKey: {
                name: "id",
                type: dynamodb.AttributeType.STRING
            },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST
        })

        this.resthandler_book = new lambda.Function(this, "resthandler_book", {
            runtime: lambda.Runtime.NODEJS_12_X,
			handler: 'lambda-book.resthandler_book',
			code: lambda.Code.fromAsset('lambda'),
            environment: {
                TABLE_NAME: table_book.tableName
            }
        })

        table_book.grantReadWriteData(this.resthandler_book);

        this.appsynchandler_getBooks = new lambda.Function(this, "appsynchandler_getBooks", {
            runtime: lambda.Runtime.NODEJS_12_X,
			handler: 'lambda-book.appsynchandler_getBooks',
			code: lambda.Code.fromAsset('lambda'),
            environment: {
                TABLE_NAME: table_book.tableName
            }
        })

        table_book.grantReadData(this.appsynchandler_getBooks);

        this.appsynchandler_getBookById = new lambda.Function(this, "appsynchandler_getBookById", {
            runtime: lambda.Runtime.NODEJS_12_X,
			handler: 'lambda-book.appsynchandler_getBookById',
			code: lambda.Code.fromAsset('lambda'),
            environment: {
                TABLE_NAME: table_book.tableName
            }
        })

        table_book.grantReadData(this.appsynchandler_getBookById);

        this.appsynchandler_createBook = new lambda.Function(this, "appsynchandler_createBook", {
            runtime: lambda.Runtime.NODEJS_12_X,
			handler: 'lambda-book.appsynchandler_createBook',
			code: lambda.Code.fromAsset('lambda'),
            environment: {
                TABLE_NAME: table_book.tableName
            }
        })

        table_book.grantReadWriteData(this.appsynchandler_createBook);
    }
}