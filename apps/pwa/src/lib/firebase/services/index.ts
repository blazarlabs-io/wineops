/* eslint-disable @typescript-eslint/no-explicit-any */
import winery from "./winery";
import vineyard from "./vineyard";
import grape from "./grape";
import vessel from "./vessel";
import consumable from "./consumable";
import must from "./must";
import action from "./action";
import team from "./team";
import labReport from "./lab-report";

const db: any = {};

db.winery = winery;
db.vineyard = vineyard;
db.grape = grape;
db.vessel = vessel;
db.consumable = consumable;
db.action = action;
db.team = team;
db.labReport = labReport;
db.must = must;

export { db };
