import { faker } from '@faker-js/faker';
import { dynamoDBClient } from '../config/dynamodb-client'
import { BookSchema } from '../entity/book.schema';

export async function createBookFaker(numRecords: number) {
    try {
        const promises = [];
        for (let i = 0; i < numRecords; i++) {
            const createBookDto = {
                bookId: faker.number.int(),
                bookName: faker.lorem.words(3),
            };

            const params = {
                TableName: BookSchema.TableName,
                Item: createBookDto,
            };

            promises.push(dynamoDBClient().put(params).promise());
        }

        await Promise.all(promises);
        console.log(`${numRecords} records inserted successfully.`);
    } catch (error) {
        console.error('Error inserting test data into DynamoDB:', error);
    }
}
