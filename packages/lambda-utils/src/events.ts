import { unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoDBStreamEvent } from "aws-lambda";

type OnChangeCallback<T extends Record<string, unknown>> = (
  oldImage: T,
  newImage: T
) => void | Promise<void>;
type OnCreateCallback<T extends Record<string, unknown>> = (
  newImage: T
) => void | Promise<void>;
type OnDeleteCallback<T extends Record<string, unknown>> = (
  oldImage: T
) => void | Promise<void>;

type ModelName<T> = T extends { __typename: string }
  ? T["__typename"]
  : "ALL_MODELS" | Omit<string, "ALL_MODELS">;

class Emitter {
  private onChangeCallbacks: Record<string, OnChangeCallback<any>[]> = {};
  private onCreateCallbacks: Record<string, OnCreateCallback<any>[]> = {};
  private onDeleteCallbacks: Record<string, OnDeleteCallback<any>[]> = {};
  private static instance: Emitter | null = null;

  private constructor() {
    this.onChangeCallbacks = {};
    this.onCreateCallbacks = {};
    this.onDeleteCallbacks = {};
  }

  static getInstance(): Emitter {
    if (!Emitter.instance) {
      Emitter.instance = new Emitter();
    }

    return Emitter.instance;
  }

  on<T extends Record<string, unknown>>(
    event: "CREATE" | "UPDATE" | "DELETE" | "ALL_EVENTS",
    modelName: ModelName<T>,
    callback: OnCreateCallback<T> | OnChangeCallback<T> | OnDeleteCallback<T>
  ) {
    switch (event) {
      case "CREATE":
        this.onModelCreate(modelName, callback as OnCreateCallback<T>);
        break;
      case "UPDATE":
        this.onModelChange(modelName, callback as OnChangeCallback<T>);
        break;
      case "DELETE":
        this.onModelDelete(modelName, callback as OnDeleteCallback<T>);
        break;
      case "ALL_EVENTS":
        this.onModelCreate(modelName, callback as OnCreateCallback<T>);
        this.onModelChange(modelName, callback as OnChangeCallback<T>);
        this.onModelDelete(modelName, callback as OnDeleteCallback<T>);
        break;
      default:
        break;
    }
  }

  onModelChange<T extends Record<string, unknown>>(
    modelName: ModelName<T>,
    callback: OnChangeCallback<T>
  ) {
    this.onChangeCallbacks[modelName as string] = [
      ...(this.onChangeCallbacks[modelName as string] || []),
      callback,
    ];
  }

  onModelCreate<T extends Record<string, unknown>>(
    modelName: ModelName<T>,
    callback: OnCreateCallback<T>
  ) {
    this.onCreateCallbacks[modelName as string] = [
      ...(this.onCreateCallbacks[modelName as string] || []),
      callback,
    ];
  }

  onModelDelete<T extends Record<string, unknown>>(
    modelName: ModelName<T>,
    callback: OnDeleteCallback<T>
  ) {
    this.onDeleteCallbacks[modelName as string] = [
      ...(this.onDeleteCallbacks[modelName as string] || []),
      callback,
    ];
  }

  async processEvent(event: DynamoDBStreamEvent) {
    for (const Record of event.Records) {
      let eventName = Record.eventName;
      let dynamodbData = Record.dynamodb;
      let eventSourceARN = Record.eventSourceARN;
      let modelName = eventSourceARN?.split("/")?.[1]?.split("-").shift();

      // @ts-expect-error - type mismatch
      let newData = unmarshall(dynamodbData?.NewImage || {});
      // @ts-expect-error - type mismatch
      let previousData = unmarshall(dynamodbData?.OldImage || {});

      console.log({ eventName, modelName, eventSourceARN });
      switch (eventName) {
        case "INSERT":
          {
            const fns = this.onCreateCallbacks[modelName || ""] || [];
            const globals = this.onCreateCallbacks["ALL_MODELS"] || [];
            await Promise.all(
              // @ts-expect-error - global listeners expect old and new data
              globals?.map((callback) => callback(previousData, newData))
            );
            await Promise.all(fns?.map((callback) => callback(newData)));
          }
          break;
        case "MODIFY":
          {
            const fns = this.onChangeCallbacks[modelName || ""] || [];
            const globals = this.onChangeCallbacks["ALL_MODELS"] || [];
            await Promise.all(
              globals?.map((callback) => callback(previousData, newData))
            );
            await Promise.all(
              fns?.map((callback) => callback(previousData, newData))
            );
          }
          break;
        case "REMOVE":
          {
            const fns = this.onDeleteCallbacks[modelName || ""] || [];
            const globals = this.onDeleteCallbacks["ALL_MODELS"] || [];
            await Promise.all(
              // @ts-expect-error - global listeners expect old and new data
              globals?.map((callback) => callback(previousData, newData))
            );
            await Promise.all(fns?.map((callback) => callback(previousData)));
          }
          break;
        default:
          break;
      }
    }
  }
}

export const emitter = Emitter.getInstance();
