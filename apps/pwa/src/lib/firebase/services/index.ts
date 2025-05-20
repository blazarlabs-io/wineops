/* eslint-disable @typescript-eslint/no-explicit-any */
import winery from "./winery";
import vineyard from "./vineyard";
import grape from "./grape";

const db: any = {};

db.winery = winery;
db.vineyard = vineyard;
db.grape = grape;

export { db };
