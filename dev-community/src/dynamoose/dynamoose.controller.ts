import { Controller, Post, Body, Get } from '@nestjs/common';
import { DynamooseService } from './dynamoose.service';
import { CreateBookDto } from "../dynamo/dto/create-book.dto"

@Controller('dynamoose')
export class DynamooseController {
    constructor(private dynamooseService: DynamooseService) { }

    @Post('/create-tables')
    createTables() {
        return this.dynamooseService.createTable();
    }

    @Post('/books')
    createBook(@Body() createBookDto: CreateBookDto) {
        return this.dynamooseService.createBook(createBookDto);
    }

    @Get('/books')
    findAllBooks() {
        return this.dynamooseService.findAllBooks();
    }
}
