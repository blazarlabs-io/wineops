import { Must } from "@/models/types/db";
import {
  // generateItems,
  generateNotes,
  generateTasks,
} from "@/utils/generators";
import { Timestamp } from "firebase/firestore";

export const mustDataSample: Must[] = [
  {
    id: "1",
    name: "Must 1",
    group: ["Group 1", "Group 2"],
    grapes: ["Grape 1", "Grape 2"],
    vineyards: ["Vineyard 1", "Vineyard 2"],
    status: "Status 1",
    quantity: 3000,
    labData: [], //generateItems(5),
    createdAt: Timestamp.now(),
    vessel: {
      id: "1",
      name: "Vessel 1",
    },
    location: "Argentina",
    notes: generateNotes(),
    tasks: generateTasks(),
    grapeVariety: "Grape Variety 1",
  },
];
