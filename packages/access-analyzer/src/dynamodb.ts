import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  DeleteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

export class DynamoDBModule {
  constructor(
    private dynamodbClient: DynamoDBClient,
    private tableNameSuffix: string
  ) {}

  async createTableItem(tableName: string, item: Record<string, any>) {
    return await this.dynamodbClient.send(
      new PutItemCommand({
        TableName: `${tableName}-${this.tableNameSuffix}`,
        Item: marshall(item),
        ReturnValues: "ALL_OLD",
      })
    );
  }

  async getTableItem(tableName: string, key: Record<string, any>) {
    return unmarshall(
      (
        await this.dynamodbClient.send(
          new GetItemCommand({
            TableName: `${tableName}-${this.tableNameSuffix}`,
            Key: marshall(key),
          })
        )
      )?.Item ?? {}
    );
  }

  async deleteTableItem(tableName: string, key: Record<string, any>) {
    await this.dynamodbClient.send(
      new DeleteItemCommand({
        TableName: `${tableName}-${this.tableNameSuffix}`,
        Key: marshall(key),
      })
    );
  }
}
