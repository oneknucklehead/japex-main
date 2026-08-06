import { Client, Databases, Storage, Account } from "appwrite"; // web SDK

export function createClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

  return {
    client,
    databases: new Databases(client),
    storage: new Storage(client),
    account: new Account(client),
  };
}

export const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "japex";
export const BUCKET_ID = "car-images";
