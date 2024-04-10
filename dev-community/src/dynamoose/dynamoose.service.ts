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

    async createTable() {
        try {
            const book = dynamoose.model('Book', BookSchema);

            await new dynamoose.Table('Book', [book]);

            console.log(`Table created successfully`);
        } catch (error) {
            console.log(error);
        }
    }

    async createBook(createBookDto: CreateBookDto): Promise<any> {
        try {
            const book = dynamoose.model('Book', BookSchema);

            const newBook = new book(createBookDto);

            return newBook.save();
        } catch (error) {
            console.log(error);
        }
    }

    async findAllBooks(): Promise<any> {
        try {
            const book = dynamoose.model('Book', BookSchema);

            return book.scan().exec();
        } catch (error) {
            console.log(error);
        }
    }

    // async deleteTable() {
    //     await dynamoose.model('Book').table.delete();
    // }

    // async putItem(item) {
    //     const book = new dynamoose.model('Book')(item);
    //     return book.save();
    // }

    // async getItem(id) {
    //     return dynamoose.model('Book').get(id);
    // }

    // async scanItems() {
    //     return dynamoose.model('Book').scan().exec();
    // }

    // async queryItems(id) {
    //     return dynamoose.model('Book').query('id').eq(id).exec();
    // }

    // async updateItem(id, item) {
    //     return dynamoose.model('Book').update({ id }, item);
    // }

    // async deleteItem(id) {
    //     return dynamoose.model('Book').delete(id);
    // }
}
