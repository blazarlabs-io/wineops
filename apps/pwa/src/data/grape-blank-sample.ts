import { Grape } from "@/models/types/db";

const grapeBlankSample: Grape = {
  id: Date.now().toString(),
  name: "",
  date: "",
  rowType: "item",
  group: [],
} as unknown as Grape;

export default grapeBlankSample;
