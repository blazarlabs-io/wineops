/* eslint-disable @typescript-eslint/no-explicit-any */
import winery from './winery';
import vineyard from './vineyard';

const db: any = {};

db.winery = winery;
db.vineyard = vineyard;

export { db };
