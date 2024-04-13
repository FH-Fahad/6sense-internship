import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { AWS_REGION, DYNAMODB_ENDPOINT } from '../dynamo/config/config'
// import { dynamoDBClient } from '../dynamo/config/dynamodb-client';
import * as dynamoose from "dynamoose";
import { BookSchema } from './entity/book-schema';
import { CreateBookDto } from "../dynamo/dto/create-book.dto"


@Injectable()
export class DynamooseService {
    private dynamodb: AWS.DynamoDB;

    constructor() {
        this.dynamodb = new AWS.DynamoDB({
            region: AWS_REGION,
            endpoint: DYNAMODB_ENDPOINT,
        });
    }

    createTable() {
        try {
            const book = dynamoose.model('Book', BookSchema);

            new dynamoose.Table('Book', [book]);

            console.log(`Table created successfully`);
        } catch (error) {
            console.log(error);
        }
    }

    createBook(createBookDto: CreateBookDto): Promise<any> {
        try {
            const book = dynamoose.model('Book', BookSchema);

            const newBook = new book(createBookDto);

            return newBook.save();
        } catch (error) {
            console.log(error);
        }
    }

    findAllBooks(): Promise<any> {
        try {
            const book = dynamoose.model('Book', BookSchema);

            return book.scan().exec();
        } catch (error) {
            console.log(error);
        }
    }
}
