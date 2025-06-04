/* eslint-disable @typescript-eslint/no-explicit-any */
import winery from "./winery";
import vineyard from "./vineyard";
import grape from "./grape";
import vessel from "./vessel";
import consumable from "./consumable";

const db: any = {};

db.winery = winery;
db.vineyard = vineyard;
db.grape = grape;
db.vessel = vessel;
db.consumable = consumable;

export { db };
