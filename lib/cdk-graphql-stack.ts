import * as cdk from '@aws-cdk/core';
import * as apiGateway from '@aws-cdk/aws-apigateway';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3Deployment from '@aws-cdk/aws-s3-deployment';
import * as appsync from '@aws-cdk/aws-appsync';

import { BackendBook } from './backend-book';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkGraphqlStack extends cdk.Stack {
	constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const backend_book = new BackendBook(this, "backend_book");

		// The code that defines your stack goes here

		// example resource
		// const queue = new sqs.Queue(this, 'AwsCdkTestQueue', {
		//   visibilityTimeout: cdk.Duration.seconds(300)
		// });
		const restapi_book = new apiGateway.LambdaRestApi(this, "restapi_book", {
			handler: backend_book.resthandler_book
		});
		new cdk.CfnOutput(this, "restapi_book_url", {
			value: restapi_book.url
		});

		const graphqlapi_book = new appsync.GraphqlApi(this, "graphqlapi_book", {
			name: "graphqlapi_book",
			schema: appsync.Schema.fromAsset('graphql/schema.graphql'),
			authorizationConfig: {
				defaultAuthorization: {
					authorizationType: appsync.AuthorizationType.API_KEY,
					apiKeyConfig: {
						name: "My very own API key",
						expires: cdk.Expiration.after(cdk.Duration.days(365))
					}
				}
			}
		});
		new cdk.CfnOutput(this, "graphqlapi_book_url", {
			value: graphqlapi_book.graphqlUrl
		});


		const datasource_getBooks = graphqlapi_book.addLambdaDataSource("datasource_getBooks", backend_book.appsynchandler_getBooks);
		datasource_getBooks.createResolver({ typeName: "Query", fieldName: "getBooks", });

		const datasource_getBookById = graphqlapi_book.addLambdaDataSource("datasource_getBookById", backend_book.appsynchandler_getBookById);
		datasource_getBookById.createResolver({ typeName: "Query", fieldName: "getBookById", });

		const datasource_createBook = graphqlapi_book.addLambdaDataSource("datasource_createBook", backend_book.appsynchandler_createBook);
		datasource_createBook.createResolver({ typeName: "Mutation", fieldName: "createBook", });


		/*
		const websiteBucket = new s3.Bucket(this, "WebsiteBucket", {
			publicReadAccess: true,
			websiteIndexDocument: "index.html"
		});

		new s3Deployment.BucketDeployment(this, "DeployWebsite", {
			destinationBucket: websiteBucket,
			sources: [s3Deployment.Source.asset("frontend/build")]
		});
		*/
	}
}
