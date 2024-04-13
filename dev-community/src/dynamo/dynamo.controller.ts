import { Post, Get, Controller, Body, Param } from '@nestjs/common';
import { DynamoService } from './dynamo.service';
import { Public } from '../common/decorators/public-decorators';
// import { CreateBookDto } from "./dto/create-book.dto"
import { CreateAuthorDto } from "./dto/create-author.dto"
import { CreateBookAuthorDto } from "./dto/create-book-author.dto"

@Controller('dynamo')
export class DynamoController {
    constructor(private dynamoService: DynamoService) { }

    // Initializing the tables
    @Public()
    @Post('/create-tables')
    createTables() {
        return this.dynamoService.createTables();
    }

    // Creating a book
    @Public()
    @Post('/books')
    createBook() {
        return this.dynamoService.createBook();
    }

    // Finding all books
    @Public()
    @Get('/books')
    findAllBooks() {
        return this.dynamoService.findAllBooks();
    }

    // Creating an author
    @Public()
    @Post('/authors')
    createAuthor(@Body() createAuthorDto: CreateAuthorDto) {
        return this.dynamoService.createAuthor(createAuthorDto);
    }

    // Finding all authors
    @Public()
    @Get('/authors')
    findAllAuthors() {
        return this.dynamoService.findAllAuthors();
    }

    // Create a book author
    @Public()
    @Post('/book-author')
    createBookAuthor(@Body() createBookAuthorDto: CreateBookAuthorDto) {
        return this.dynamoService.createBookAuthor(createBookAuthorDto);
    }

    // Finding all books by an author
    @Public()
    @Get('/authors/:authorId')
    findBooksByAuthorId(@Param('authorId') authorId: number) {
        return this.dynamoService.findBooksByAuthorId(authorId);
    }
}
