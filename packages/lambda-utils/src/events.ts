import { unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoDBStreamEvent } from "aws-lambda";

type CallbackContext<T> = {
  oldImage: T;
  newImage: T;
  eventName: "INSERT" | "MODIFY" | "REMOVE" | undefined;
  modelName: string | undefined;
  eventSourceARN: string | undefined;
};

type Callback<T extends Record<string, unknown>> = (
  args: CallbackContext<T>
) => void | Promise<void>;

type ModelName<T> = T extends { __typename: string }
  ? T["__typename"]
  : "ALL_MODELS" | Omit<string, "ALL_MODELS">;

type CallbackOptions = {
  enabled?: boolean;
};

class Emitter {
  private onChangeCallbacks: Record<string, Callback<any>[]> = {};
  private onCreateCallbacks: Record<string, Callback<any>[]> = {};
  private onDeleteCallbacks: Record<string, Callback<any>[]> = {};
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
    callback: Callback<T>,
    options: CallbackOptions = { enabled: true }
  ) {
    if (!options?.enabled) return;
    switch (event) {
      case "CREATE":
        this.onModelCreate(modelName, callback);
        break;
      case "UPDATE":
        this.onModelChange(modelName, callback);
        break;
      case "DELETE":
        this.onModelDelete(modelName, callback);
        break;
      case "ALL_EVENTS":
        this.onModelCreate(modelName, callback);
        this.onModelChange(modelName, callback);
        this.onModelDelete(modelName, callback);
        break;
      default:
        break;
    }
  }

  onModelChange<T extends Record<string, unknown>>(
    modelName: ModelName<T>,
    callback: Callback<T>,
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
    callback: Callback<T>,
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
    callback: Callback<T>,
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

      const context = {
        oldImage,
        newImage,
        eventName,
        modelName,
        eventSourceARN,
      };

      switch (eventName) {
        case "INSERT":
          {
            const fns = this.onCreateCallbacks[modelName || ""] || [];
            const globals = this.onCreateCallbacks["ALL_MODELS"] || [];
            await Promise.all(
              [...globals, ...fns]?.map((callback) => callback(context))
            );
          }
          break;
        case "MODIFY":
          {
            const fns = this.onChangeCallbacks[modelName || ""] || [];
            const globals = this.onChangeCallbacks["ALL_MODELS"] || [];
            await Promise.all(
              [...globals, ...fns]?.map((callback) => callback(context))
            );
          }
          break;
        case "REMOVE":
          {
            const fns = this.onDeleteCallbacks[modelName || ""] || [];
            const globals = this.onDeleteCallbacks["ALL_MODELS"] || [];
            await Promise.all(
              [...globals, ...fns]?.map((callback) => callback(context))
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
