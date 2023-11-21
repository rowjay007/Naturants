/* eslint-disable @typescript-eslint/no-explicit-any */
import { Redis, RedisOptions } from "ioredis";
import { promisify } from "util";

class RedisService {
  private client: Redis;

  // Initialize methods with proper types
  public getAsync!: (key: string) => Promise<string | null>;
  public setAsync!: (key: string, value: string) => Promise<string>;
  public delAsync!: (key: string) => Promise<number>;
  public hsetAsync!: (
    key: string,
    field: string,
    value: string
  ) => Promise<number>;
  public hgetAsync!: (key: string, field: string) => Promise<string | null>;
  public hdelAsync!: (key: string, field: string) => Promise<number>;
  public hgetallAsync!: (key: string) => Promise<any>;
  public hincrbyAsync!: (
    key: string,
    field: string,
    value: number
  ) => Promise<number>;
  public hincrbyfloatAsync!: (
    key: string,
    field: string,
    value: number
  ) => Promise<number>;
  public hkeysAsync!: (key: string) => Promise<string[]>;

  constructor(options: RedisOptions) {
    // Initialize the client
    this.client = new Redis(options);

    // Bind methods after the client is initialized
    this.getAsync = promisify(this.client.get).bind(this.client) as (
      key: string
    ) => Promise<string | null>;
    this.setAsync = promisify(this.client.set).bind(this.client) as (
      key: string,
      value: string
    ) => Promise<string>;
    this.delAsync = promisify(this.client.del).bind(this.client) as (
      key: string
    ) => Promise<number>;
    this.hsetAsync = promisify(this.client.hset).bind(this.client) as (
      key: string,
      field: string,
      value: string
    ) => Promise<number>;
    this.hgetAsync = promisify(this.client.hget).bind(this.client) as (
      key: string,
      field: string
    ) => Promise<string | null>;
    this.hdelAsync = promisify(this.client.hdel).bind(this.client) as (
      key: string,
      field: string
    ) => Promise<number>;
    this.hgetallAsync = promisify(this.client.hgetall).bind(this.client) as (
      key: string
    ) => Promise<any>;
    this.hincrbyAsync = promisify(this.client.hincrby).bind(this.client) as (
      key: string,
      field: string,
      value: number
    ) => Promise<number>;

    this.client.on("error", (err) => console.log("Redis Client Error", err));
    this.client.on("connect", () => console.log("Redis Client Connected"));
    this.client.on("ready", () => console.log("Redis Client Ready"));
    this.client.on("end", () => console.log("Redis Client Ended"));
    this.client.on("reconnecting", () =>
      console.log("Redis Client Reconnecting")
    );
    this.client.on("warning", (err) =>
      console.log("Redis Client Warning", err)
    );
  }

  public getClient(): Redis {
    return this.client;
  }
}

export default RedisService;
