import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { getConfiguration } from './configuration';
dotenv.config();

export default new DataSource(getConfiguration().database);
