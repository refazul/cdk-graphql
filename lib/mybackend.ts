import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';

export class MyBackend extends cdk.Construct {
    public readonly resthandler: lambda.Function;
    public readonly appsynchandler_list: lambda.Function;
    public readonly appsynchandler_create: lambda.Function;

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id);

        const myTable = new dynamodb.Table(this, "MyDatabase", {
            partitionKey: {
                name: "id",
                type: dynamodb.AttributeType.STRING
            },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST
        })

        this.resthandler = new lambda.Function(this, "MyRestHandler", {
            runtime: lambda.Runtime.NODEJS_12_X,
			handler: 'mylambda.resthandler',
			code: lambda.Code.fromAsset('lambda'),
            environment: {
                TABLE_NAME: myTable.tableName
            }
        })

        myTable.grantReadWriteData(this.resthandler);

        this.appsynchandler_list = new lambda.Function(this, "MyAppSyncHandler_list", {
            runtime: lambda.Runtime.NODEJS_12_X,
			handler: 'mylambda.appsynchandler_list',
			code: lambda.Code.fromAsset('lambda'),
            environment: {
                TABLE_NAME: myTable.tableName
            }
        })

        myTable.grantReadWriteData(this.appsynchandler_list);

        this.appsynchandler_create = new lambda.Function(this, "MyAppSyncHandler_create", {
            runtime: lambda.Runtime.NODEJS_12_X,
			handler: 'mylambda.appsynchandler_create',
			code: lambda.Code.fromAsset('lambda'),
            environment: {
                TABLE_NAME: myTable.tableName
            }
        })

        myTable.grantReadWriteData(this.appsynchandler_create);
    }
}