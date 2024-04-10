export const BookSchema = {
    TableName: 'Books',
    KeySchema: [
        { AttributeName: 'bookId', KeyType: 'HASH' },
        { AttributeName: 'bookName', KeyType: 'RANGE' },
    ],
    AttributeDefinitions: [
        { AttributeName: 'bookId', AttributeType: 'N' },
        { AttributeName: 'bookName', AttributeType: 'S' },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
    },
}
