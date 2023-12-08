import { unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoDBStreamEvent } from "aws-lambda";

type OnChangeCallback<T extends Record<string, unknown>> = (args: {
  oldImage: T;
  newImage: T;
}) => void | Promise<void>;
type OnCreateCallback<T extends Record<string, unknown>> = (args: {
  oldImage: T;
  newImage: T;
}) => void | Promise<void>;
type OnDeleteCallback<T extends Record<string, unknown>> = (args: {
  oldImage: T;
  newImage: T;
}) => void | Promise<void>;

type ModelName<T> = T extends { __typename: string }
  ? T["__typename"]
  : "ALL_MODELS" | Omit<string, "ALL_MODELS">;

type CallbackOptions = {
  enabled?: boolean;
};

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
    callback: OnCreateCallback<T> | OnChangeCallback<T> | OnDeleteCallback<T>,
    options: CallbackOptions = { enabled: true }
  ) {
    if (!options?.enabled) return;
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
    callback: OnChangeCallback<T>,
    options: CallbackOptions = { enabled: true }
  ) {
    if (!options?.enabled) return;
    this.onChangeCallbacks[modelName as string] = [
      ...(this.onChangeCallbacks[modelName as string] || []),
      callback,
    ];
  }

  onModelCreate<T extends Record<string, unknown>>(
    modelName: ModelName<T>,
    callback: OnCreateCallback<T>,
    options: CallbackOptions = { enabled: true }
  ) {
    if (!options?.enabled) return;
    this.onCreateCallbacks[modelName as string] = [
      ...(this.onCreateCallbacks[modelName as string] || []),
      callback,
    ];
  }

  onModelDelete<T extends Record<string, unknown>>(
    modelName: ModelName<T>,
    callback: OnDeleteCallback<T>,
    options: CallbackOptions = { enabled: true }
  ) {
    if (!options?.enabled) return;
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
      let newImage = unmarshall(dynamodbData?.NewImage || {});
      // @ts-expect-error - type mismatch
      let oldImage = unmarshall(dynamodbData?.OldImage || {});

      console.log({ eventName, modelName, eventSourceARN });
      switch (eventName) {
        case "INSERT":
          {
            const fns = this.onCreateCallbacks[modelName || ""] || [];
            const globals = this.onCreateCallbacks["ALL_MODELS"] || [];
            await Promise.all(
              globals?.map((callback) => callback({ oldImage, newImage }))
            );
            await Promise.all(
              fns?.map((callback) => callback({ oldImage, newImage }))
            );
          }
          break;
        case "MODIFY":
          {
            const fns = this.onChangeCallbacks[modelName || ""] || [];
            const globals = this.onChangeCallbacks["ALL_MODELS"] || [];
            await Promise.all(
              globals?.map((callback) => callback({ oldImage, newImage }))
            );
            await Promise.all(
              fns?.map((callback) => callback({ oldImage, newImage }))
            );
          }
          break;
        case "REMOVE":
          {
            const fns = this.onDeleteCallbacks[modelName || ""] || [];
            const globals = this.onDeleteCallbacks["ALL_MODELS"] || [];
            await Promise.all(
              globals?.map((callback) => callback({ oldImage, newImage }))
            );
            await Promise.all(
              fns?.map((callback) => callback({ oldImage, newImage }))
            );
          }
          break;
        default:
          break;
      }
    }
  }
}

export const emitter = Emitter.getInstance();
