import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { getConfiguration } from './configuration';
dotenv.config();

export const AppDataSource = new DataSource(getConfiguration().database);
