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
    modelName: string | "ALL_MODELS",
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
    modelName: string,
    callback: OnChangeCallback<T>
  ) {
    this.onChangeCallbacks[modelName] = [
      ...(this.onChangeCallbacks[modelName] || []),
      callback,
    ];
  }

  onModelCreate<T extends Record<string, unknown>>(
    modelName: string,
    callback: OnCreateCallback<T>
  ) {
    this.onCreateCallbacks[modelName] = [
      ...(this.onCreateCallbacks[modelName] || []),
      callback,
    ];
  }

  onModelDelete<T extends Record<string, unknown>>(
    modelName: string,
    callback: OnDeleteCallback<T>
  ) {
    this.onDeleteCallbacks[modelName] = [
      ...(this.onDeleteCallbacks[modelName] || []),
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
