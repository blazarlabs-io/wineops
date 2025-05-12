import { generateLabData } from "@/utils/lab-data-generator";

export function getData() {
  return [
    {
      group: ["Group One", "Vineyard 2"],
      name: "Vineyard 2",
      grapeVariety: "Cabernet Sauvignon",
      status: "NOT-STARTED",
      forcastedYield: 0,
      labData: generateLabData(),
      tasks: [
        {
          amount: 2,
          id: "1",
          status: "todo",
          title: "Task 1",
          description: "Task 1 description",
        },
        {
          id: "2",
          title: "Task 2",
          description: "Task 2 description",
          status: "in-progress",
        },
        {
          id: "3",
          title: "Task 3",
          description: "Task 3 description",
          status: "completed",
        },
      ],
      notes: [
        {
          content: "This is a test note. You can add, edit, and delete notes.",
          id: "1",
          title: "Welcome, new user!",
        },
        {
          content: "This is a test note. You can add, edit, and delete notes.",
          id: "2",
          title: "Welcome, new user!",
        },
      ],
    },
    {
      group: ["Group One", "Vineyard 3"],
      name: "Vineyard 3",
      grapeVariety: "Chardonnay",
      status: "NOT-STARTED",
      forcastedYield: 0,
      labData: generateLabData(),
      tasks: [
        {
          amount: 2,
          id: "1",
          status: "todo",
          title: "Task 1",
          description: "Task 1 description",
        },
        {
          amount: 1,
          id: "2",
          title: "Task 2",
          description: "Task 2 description",
          status: "in-progress",
        },
        {
          amount: 10,
          id: "3",
          title: "Task 3",
          description: "Task 3 description",
          status: "completed",
        },
      ],
      notes: [
        {
          content: "This is a test note. You can add, edit, and delete notes.",
          id: "1",
          title: "Welcome, new user!",
        },
        {
          content: "This is a test note. You can add, edit, and delete notes.",
          id: "2",
          title: "Welcome, new user!",
        },
      ],
    },
    {
      group: ["Group One", "Sub Group One", "Vineyard 4"],
      name: "Vineyard 4",
      grapeVariety: "Merlot",
      status: "NOT-STARTED",
      forcastedYield: 0,
      labData: generateLabData(),
      tasks: [
        {
          amount: 2,
          id: "1",
          status: "todo",
          title: "Task 1",
          description: "Task 1 description",
        },
        {
          amount: 9,
          id: "2",
          title: "Task 2",
          description: "Task 2 description",
          status: "in-progress",
        },
        {
          amount: 10,
          id: "3",
          title: "Task 3",
          description: "Task 3 description",
          status: "completed",
        },
      ],
      notes: [
        {
          content: "This is a test note. You can add, edit, and delete notes.",
          id: "1",
          title: "Welcome, new user!",
        },
        {
          content: "This is a test note. You can add, edit, and delete notes.",
          id: "2",
          title: "Welcome, new user!",
        },
      ],
    },
    {
      group: ["Group One", "Sub Group Two", "Vineyard 5"],
      name: "Vineyard 5",
      grapeVariety: "Cabernet Sauvignon",
      status: "NOT-STARTED",
      forcastedYield: 0,
      labData: generateLabData(),
      tasks: [
        {
          amount: 2,
          id: "1",
          status: "todo",
          title: "Task 1",
          description: "Task 1 description",
        },
        {
          id: "2",
          title: "Task 2",
          description: "Task 2 description",
          status: "in-progress",
        },
        {
          id: "3",
          title: "Task 3",
          description: "Task 3 description",
          status: "completed",
        },
      ],
      notes: [
        {
          content: "This is a test note. You can add, edit, and delete notes.",
          id: "1",
          title: "Welcome, new user!",
        },
        {
          content: "This is a test note. You can add, edit, and delete notes.",
          id: "2",
          title: "Welcome, new user!",
        },
      ],
    },
    {
      group: ["Group One", "Sub Group Two", "Vineyard 7"],
      name: "Vineyard 7",
      grapeVariety: "Cabernet Sauvignon",
      status: "NOT-STARTED",
      forcastedYield: 0,
      labData: generateLabData(),
      tasks: [
        {
          amount: 2,
          id: "1",
          status: "todo",
          title: "Task 1",
          description: "Task 1 description",
        },
        {
          id: "2",
          title: "Task 2",
          description: "Task 2 description",
          status: "in-progress",
        },
        {
          id: "3",
          title: "Task 3",
          description: "Task 3 description",
          status: "completed",
        },
      ],
      notes: [
        {
          content: "This is a test note. You can add, edit, and delete notes.",
          id: "1",
          title: "Welcome, new user!",
        },
        {
          content: "This is a test note. You can add, edit, and delete notes.",
          id: "2",
          title: "Welcome, new user!",
        },
      ],
    },
    {
      group: ["Group Two", "Vineyard 1"],
      name: "Vineyard 1",
      grapeVariety: "Cabernet Sauvignon",
      status: "NOT-STARTED",
      forcastedYield: 0,
      labData: generateLabData(),
      tasks: [
        {
          amount: 2,
          id: "1",
          status: "todo",
          title: "Task 1",
          description: "Task 1 description",
        },
        {
          id: "2",
          title: "Task 2",
          description: "Task 2 description",
          status: "in-progress",
        },
        {
          id: "3",
          title: "Task 3",
          description: "Task 3 description",
          status: "completed",
        },
      ],
      notes: [
        {
          content: "This is a test note. You can add, edit, and delete notes.",
          id: "1",
          title: "Welcome, new user!",
        },
        {
          content: "This is a test note. You can add, edit, and delete notes.",
          id: "2",
          title: "Welcome, new user!",
        },
      ],
    },
    {
      group: ["Group Two", "Vineyard 6"],
      name: "Vineyard 6",
      grapeVariety: "Cabernet Sauvignon",
      status: "NOT-STARTED",
      forcastedYield: 0,
      labData: generateLabData(),
      tasks: [
        {
          amount: 2,
          id: "1",
          status: "todo",
          title: "Task 1",
          description: "Task 1 description",
        },
        {
          id: "2",
          title: "Task 2",
          description: "Task 2 description",
          status: "in-progress",
        },
        {
          id: "3",
          title: "Task 3",
          description: "Task 3 description",
          status: "completed",
        },
      ],
      notes: [
        {
          content: "This is a test note. You can add, edit, and delete notes.",
          id: "1",
          title: "Welcome, new user!",
        },
        {
          content: "This is a test note. You can add, edit, and delete notes.",
          id: "2",
          title: "Welcome, new user!",
        },
      ],
    },
  ];
}
