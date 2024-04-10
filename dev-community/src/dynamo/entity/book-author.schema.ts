export const BookAuthorsSchema = {
    TableName: 'BookAuthors',
    KeySchema: [
        { AttributeName: 'bookId', KeyType: 'HASH' },
        { AttributeName: 'authorId', KeyType: 'RANGE' }  // Sort key
    ],
    AttributeDefinitions: [
        { AttributeName: 'bookId', AttributeType: 'N' },
        { AttributeName: 'authorId', AttributeType: 'N' },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
    },
}
