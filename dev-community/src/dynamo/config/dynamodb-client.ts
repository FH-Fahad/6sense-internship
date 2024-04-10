import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { AWS_REGION, DYNAMODB_ENDPOINT } from './config';

AWS.config.update({
    region: 'us-east-1',
    accessKeyId: 'xxxx',
    secretAccessKey: 'xxxx',
});

export const dynamoDBClient = (): DocumentClient => {
    return new AWS.DynamoDB.DocumentClient({
        region: AWS_REGION,
        endpoint: DYNAMODB_ENDPOINT,
    });
};
