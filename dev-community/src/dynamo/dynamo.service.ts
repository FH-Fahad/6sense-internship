import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { BookSchema } from './entity/book.schema';
import { AuthorSchema } from './entity/author.schema';
// import { CreateBookDto } from './dto/create-book.dto';
import { CreateAuthorDto } from './dto/create-author.dto';
import { dynamoDBClient } from './config/dynamodb-client';
import { BookAuthorsSchema } from './entity/book-author.schema';
import { CreateBookAuthorDto } from './dto/create-book-author.dto';
import { AWS_REGION, DYNAMODB_ENDPOINT } from './config/config'
import { createBookFaker } from './faker/create-book.faker'

@Injectable()
export class DynamoService {
    private dynamodb: AWS.DynamoDB;

    constructor() {
        this.dynamodb = new AWS.DynamoDB({
            region: AWS_REGION,
            endpoint: DYNAMODB_ENDPOINT,
        });
    }

    // Create tables
    async createTables(): Promise<void> {
        try {
            await this.deleteTableIfExists(BookSchema.TableName);
            await this.deleteTableIfExists(AuthorSchema.TableName);
            await this.deleteTableIfExists(BookAuthorsSchema.TableName);

            await this.createTable(BookSchema);
            await this.createTable(AuthorSchema);
            await this.createTable(BookAuthorsSchema);
        } catch (error) {
            console.error('Error creating tables:', error);
            throw error;
        }
    }

    // Create table
    async createTable(params: AWS.DynamoDB.CreateTableInput): Promise<void> {
        try {
            await this.dynamodb.createTable(params).promise();
        } catch (error) {
            console.error('Error creating table:', error);
            throw error;
        }
    }

    // Delete table if exists
    async deleteTableIfExists(tableName: string): Promise<void> {
        try {
            await this.dynamodb.deleteTable({ TableName: tableName }).promise();
            console.log(`Table '${tableName}' deleted successfully.`);
        } catch (error) {
            if (error.code !== 'ResourceNotFoundException') {
                console.error('Error deleting table:', error);
                throw error;
            }
        }
    }

    // Create a book
    async createBook(): Promise<any> {
        try {
            return await createBookFaker(50);
        } catch (error) {
            if (error.message.startsWith('Book with id')) {
                return {
                    message: error.message
                }
            } else {
                return {
                    message: 'Error creating book'
                };
            }
        }
    }

    // Find all books
    async findAllBooks(): Promise<AWS.DynamoDB.DocumentClient.ScanOutput> {
        try {
            const books = await dynamoDBClient().scan({
                TableName: BookSchema.TableName,
            }).promise();

            return books;
        } catch (error) {
            console.error('Error fetching books:', error);
            throw error;
        }
    }

    // Create an author
    async createAuthor(createAuthorDto: CreateAuthorDto): Promise<CreateAuthorDto> {
        try {
            await dynamoDBClient().put({
                TableName: AuthorSchema.TableName,
                Item: createAuthorDto,
            }).promise();

            return createAuthorDto;
        } catch (error) {
            console.error('Error creating author:', error);
            throw error;
        }
    }

    // Find all authors
    async findAllAuthors(): Promise<AWS.DynamoDB.DocumentClient.ScanOutput> {
        try {
            const authors = await dynamoDBClient().scan({
                TableName: AuthorSchema.TableName,
            }).promise();

            return authors;
        } catch (error) {
            console.error('Error fetching authors:', error);
            throw error;
        }
    }

    // Create a book author
    async createBookAuthor(createBookAuthorDto: CreateBookAuthorDto): Promise<CreateBookAuthorDto> {
        try {
            await dynamoDBClient().put({
                TableName: BookAuthorsSchema.TableName,
                Item: createBookAuthorDto,
            }).promise();

            return createBookAuthorDto;
        } catch (error) {
            console.error('Error creating book author:', error);
            throw error;
        }
    }

    // Find all books by an author
    async findBooksByAuthorId(authorId: number) {

        //TODO: Find all books by an author
        try {
            const bookAuthorParams = {
                TableName: BookAuthorsSchema.TableName,
                FilterExpression: 'authorId = :authorId',
                ExpressionAttributeValues: {
                    ':authorId': authorId,
                }
            };

            const bookAuthorResult = await dynamoDBClient().scan(bookAuthorParams).promise();

            const bookIds = bookAuthorResult.Items.map(item => item.bookId);

            const booksPromises = bookIds.map(async bookId => {
                const bookParams = {
                    TableName: BookSchema.TableName,
                    Key: {
                        'bookId': bookId,
                    }
                };
                const bookResult = await dynamoDBClient().get(bookParams).promise();
                return bookResult.Item;
            });

            return await Promise.all(booksPromises);
        } catch (error) {
            console.error('Error fetching books by author:', error);
            throw error;
        }
    }
}
