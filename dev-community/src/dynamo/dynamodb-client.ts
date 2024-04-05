import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

AWS.config.update({
    region: 'us-east-1',
    accessKeyId: 'xxxx',
    secretAccessKey: 'xxxx',
});

export const dynamoDBClient = (): DocumentClient => {
    return new AWS.DynamoDB.DocumentClient({
        region: 'local',
        endpoint: 'http://localhost:8000',
    });
};