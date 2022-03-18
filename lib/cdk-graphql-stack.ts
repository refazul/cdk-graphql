import * as cdk from '@aws-cdk/core';
import * as apiGateway from '@aws-cdk/aws-apigateway';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3Deployment from '@aws-cdk/aws-s3-deployment';
import * as appsync from '@aws-cdk/aws-appsync';

import { MyBackend } from './mybackend';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkGraphqlStack extends cdk.Stack {
	constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const myBackend = new MyBackend(this, "MyBackend");

		// The code that defines your stack goes here

		// example resource
		// const queue = new sqs.Queue(this, 'AwsCdkTestQueue', {
		//   visibilityTimeout: cdk.Duration.seconds(300)
		// });
		new apiGateway.LambdaRestApi(this, "MyEndpoint", {
			handler: myBackend.handler
		});

		const myGraphqlApi = new appsync.GraphqlApi(this, "MyGraphqlApi", {
			name: "my-book-api",
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
		})

		/*
		const websiteBucket = new s3.Bucket(this, "WebsiteBucket", {
			publicReadAccess: true,
			websiteIndexDocument: "index.html"
		});

		new s3Deployment.BucketDeployment(this, "DeployWebsite", {
			destinationBucket: websiteBucket,
			sources: [s3Deployment.Source.asset("frontend/build")]
		});

		new cdk.CfnOutput(this, "WebsiteAddress", {
			value: websiteBucket.bucketWebsiteUrl
		});
		*/
	}
}
