import { Vineyard, VineyardStatus } from '@/models/types/db';

const vineyardSample: Vineyard = {
  id: '',
  name: '',
  status: VineyardStatus.MAINTENANCE,
  grapeVariety: '',
  grapeColor: '',
  cadastralNumber: '',
  info: {
    location: {
      map: [],
      surface: 0,
      country: '',
      city: '',
      elevation: 0,
      orientation: '',
    },
    vines: {
      yearOfPlantation: 0,
      plantingScheme: {
        spacing: 0,
        rowOrientation: '',
        density: 0,
        trellisSystem: false,
      },
      soilType: '',
      sunlightHours: 0,
    },
    certifications: {
      eco: {
        active: false,
        fileUrl: '',
      },
      igp: {
        active: false,
        fileUrl: '',
      },
      dop: {
        active: false,
        fileUrl: '',
      },
    },
  },
  grape: {
    clonalSelection: '',
    vivcNumber: '',
    countryOfOrigin: '',
  },
  forecastedYield: 0,
  labData: {
    id: Date.now().toString(),
    fileUrl: '',
    items: [
      {
        id: Date.now().toString(),
        name: 'Sugar',
        value: 3.2,
        variation: 0.3,
        unit: 'g/dm3',
        responsible: {
          name: 'John Doe',
          email: '2Tb3T@example.com',
        },
      },
      {
        id: Date.now().toString(),
        name: 'Acidity',
        value: 4.1,
        variation: -0.6,
        unit: 'g/dm3',
        responsible: {
          name: 'John Doe',
          email: '2Tb3T@example.com',
        },
      },
      {
        id: Date.now().toString(),
        name: 'Sugar',
        value: 2.9,
        variation: -0.5,
        unit: 'g/dm3',
        responsible: {
          name: 'John Doe',
          email: '2Tb3T@example.com',
        },
      },
      {
        id: Date.now().toString(),
        name: 'Acidity',
        value: 4.7,
        variation: 0.4,
        unit: 'g/dm3',
        responsible: {
          name: 'John Doe',
          email: '2Tb3T@example.com',
        },
      },
      {
        id: Date.now().toString(),
        name: 'Sugar',
        value: 3.1,
        variation: -0.2,
        unit: 'g/dm3',
        responsible: {
          name: 'John Doe',
          email: '2Tb3T@example.com',
        },
      },
      {
        id: Date.now().toString(),
        name: 'Acidity',
        value: 4.5,
        variation: -0.3,
        unit: 'g/dm3',
        responsible: {
          name: 'John Doe',
          email: '2Tb3T@example.com',
        },
      },
    ],
    date: new Date().toISOString(),
  },
  tasks: [
    {
      id: Date.now().toString(),
      status: 'todo',
      amount: 4,
    },
    {
      id: Date.now().toString(),
      status: 'in-progress',
      amount: 7,
    },
    {
      id: Date.now().toString(),
      status: 'completed',
      amount: 3,
    },
  ],
  notes: [
    {
      id: Date.now().toString(),
      title: 'Welcome, new user!',
      content: 'This is a test note. You can add, edit, and delete notes.',
    },
  ],
  documents: [
    {
      id: Date.now().toString(),
      name: 'Contract001.pdf',
      fileUrl: '',
      owner: {
        name: 'John Doe',
        email: '2Tb3T@example.com',
      },
      uploadDate: new Date().toISOString(),
      media: {
        type: 'pdf',
        subtype: 'application/pdf',
        sizeMb: 2.12,
      },
    },
    {
      id: Date.now().toString(),
      name: 'Contract002.pdf',
      fileUrl: '',
      owner: {
        name: 'Fred Nelson',
        email: '2Tb3T@example.com',
      },
      uploadDate: new Date().toISOString(),
      media: {
        type: 'pdf',
        subtype: 'application/pdf',
        sizeMb: 1.19,
      },
    },
    {
      id: Date.now().toString(),
      name: 'Contract003.pdf',
      fileUrl: '',
      owner: {
        name: 'Larry Jackson',
        email: '2Tb3T@example.com',
      },
      uploadDate: new Date().toISOString(),
      media: {
        type: 'pdf',
        subtype: 'application/pdf',
        sizeMb: 2.23,
      },
    },
    {
      id: Date.now().toString(),
      name: 'Contract004.pdf',
      fileUrl: '',
      owner: {
        name: 'Jane Rose',
        email: '2Tb3T@example.com',
      },
      uploadDate: new Date().toISOString(),
      media: {
        type: 'pdf',
        subtype: 'application/pdf',
        sizeMb: 1.12,
      },
    },
  ],
  group: 'ungrouped',
};

export default vineyardSample;
