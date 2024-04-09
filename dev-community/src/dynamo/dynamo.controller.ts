import { Controller, Get, Post } from '@nestjs/common';
import { DynamoService } from './dynamo.service';
import { Public } from '../common/decorators/public-decorators';

@Controller('dynamo')
export class DynamoController {
    constructor(private dynamoService: DynamoService) { }

    @Public()
    @Post()
    create() {
        return this.dynamoService.create();
    }

    @Public()
    @Get('/books')
    findAllBooks() {
        return this.dynamoService.findAllBooks();
    }
}
