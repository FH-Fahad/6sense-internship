import { Injectable } from '@nestjs/common';
import { dynamoDBClient } from './dynamodb-client';
import * as AWS from 'aws-sdk';

@Injectable()
export class DynamoService {
    private dynamodb: AWS.DynamoDB;

    constructor() {
        this.dynamodb = new AWS.DynamoDB({
            region: 'local',
            endpoint: 'http://localhost:8000',
        });
    }

    async createTable(tableName: string): Promise<void> {
        const book: AWS.DynamoDB.CreateTableInput = {
            TableName: tableName,
            AttributeDefinitions: [
                {
                    AttributeName: 'id',
                    AttributeType: 'N',
                },
                {
                    AttributeName: 'bookName',
                    AttributeType: 'S',
                }
            ],
            KeySchema: [
                {
                    AttributeName: 'id',
                    KeyType: 'HASH', // Partition key
                },
                {
                    AttributeName: 'bookName',
                    KeyType: 'RANGE', // Sort key
                }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5, // Adjust according to your needs
                WriteCapacityUnits: 5, // Adjust according to your needs
            },
        };

        try {
            await this.dynamodb.createTable(book).promise();
            console.log(`Table '${tableName}' created successfully.`);
        } catch (error) {
            console.error(`Error creating table '${tableName}':`, error);
            throw error;
        }
    }

    async create() {
        await this.createTable('Books');
        const book = await dynamoDBClient().put({
            TableName: 'Books',
            Item: {
                id: 123,
                bookName: 'Book 123',
            },
        }).promise();

        return book;
    }

    async findAllBooks() {
        const results = await dynamoDBClient()
            .scan({
                TableName: 'Books',
            })
            .promise();

        return results.Items;
    }
}
