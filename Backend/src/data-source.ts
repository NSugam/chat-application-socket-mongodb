require('dotenv').config();
import "reflect-metadata";
import { DataSource } from "typeorm";

import { userEntity } from "./entity/userEntity";
import { groupEntity } from "./entity/groupEntity";
import { messagesEntity } from "./entity/messagesEntity";
import { groupMembersEntity } from "./entity/groupMembersEntity";

if (process.env.NODE_ENV === 'production') {
  var dbHost: any = process.env.DB_HOST_PROD
} else {
  var dbHost: any = process.env.DB_HOST
}

export const AppDataSource = new DataSource({
  type: "postgres",
  host: dbHost,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: "Chat-Application",

  synchronize: true,
  logging: false,

  entities: [
    userEntity, groupEntity, messagesEntity, groupMembersEntity
  ],

  migrations: [__dirname + "/migration/*.ts"],
  subscribers: [],
});