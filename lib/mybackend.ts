import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';

export class MyBackend extends cdk.Construct {
    public readonly handler: lambda.Function;

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id);

        const myTable = new dynamodb.Table(this, "MyDatabase", {
            partitionKey: {
                name: "id",
                type: dynamodb.AttributeType.STRING
            }
        })

        this.handler = new lambda.Function(this, "MyHandler", {
            runtime: lambda.Runtime.NODEJS_12_X,
			handler: 'mylambda.handler',
			code: lambda.Code.fromAsset('lambda'),
            environment: {
                TABLE_NAME: myTable.tableName
            }
        })

        myTable.grantReadWriteData(this.handler);
    }
}