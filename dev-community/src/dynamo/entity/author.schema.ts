export const AuthorSchema = {
    TableName: 'Authors',
    KeySchema: [
        { AttributeName: 'authorId', KeyType: 'HASH' },
        { AttributeName: 'authorName', KeyType: 'RANGE' },
    ],
    AttributeDefinitions: [
        { AttributeName: 'authorId', AttributeType: 'N' },
        { AttributeName: 'authorName', AttributeType: 'S' },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
    },
}
