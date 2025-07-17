import { ActionRelation, Recipe, Subject } from "@/models/types/actions";
import { Bottle, LotStatus, Wine } from "@/models/types/db";
import { generateRandomAlphanumericId } from "@/utils/random-id-generator";
import { Timestamp } from "firebase/firestore";

export const wineBottlingDataSample: Bottle[] = [
  {
    id: Date.now().toString(),
    executionDate: Timestamp.now(),
    name: "Bottling Group 1", // Add this line
    group: ["Bottling Group 1"], // Add this line
    rowType: "group",
  },
  {
    id: Date.now().toString() + "1",
    executionDate: Timestamp.now(),
    name: "Collection 1", // Add this line
    group: ["Bottling Group 1", "Collection 1"], // Add this line
    rowType: "item",
    //
    type: null,
    collectionName: "Collection 1",
    vintage: "2023",
    wines: [
      {
        id: generateRandomAlphanumericId(16) as Wine["id"],
        name: "Wine 1" as Wine["name"],
        qty: 1 as Wine["qty"],
        quantity: 1 as number,
        actions: [] as ActionRelation[],
      },
    ],
    responsible: {
      id: generateRandomAlphanumericId(16),
      name: "John Doe",
      lastName: "Doe",
      email: "ZK4o7@example.com",
      role: "member",
      avatar: "",
      department: "wine-making",
      contactPhone: "",
      labData: [] as ActionRelation[],
    },
    lotId: generateRandomAlphanumericId(12),
    lotStatus: LotStatus.PLANNED,
    bottlingLine: "Line 1, Location 1",
    bottleType: "Bottle Type 1",
    bottleSize: 0.75,
    closureType: "Closure 1",
    capsuleType: "Capsule 1",
    labelType: "Label 1",
    bottleWeight: 150,
    packagingType: "6-pack Box",
    bottlesPerBox: 6,
    packagingMaterial: "Plastic",
    palletId: "Pallet 1",
    alcohol: 12.5,
    sugar: 10,
    pH: 7.5,
    totalSO2: 0.5,
    freeSO2: 0.3,
    turbidity: 0.2,
    labCertificateId: "Certificate 1",
    numberOfBottles: 1000,
    losses: 50,
    supportingDocuments: [] as {
      name: string;
      url: string;
    }[],
  },
  {
    id: Date.now().toString() + "2",
    executionDate: Timestamp.now(),
    name: "Collection 2", // Add this line
    group: ["Bottling Group 1", "Collection 2"], // Add this line
    rowType: "item",
    //
    type: null,
    collectionName: "Collection 2",
    vintage: "2023",
    wines: [
      {
        id: generateRandomAlphanumericId(16) as Wine["id"],
        name: "Wine 2" as Wine["name"],
        qty: 1 as Wine["qty"],
        quantity: 1 as number,
        actions: [] as ActionRelation[],
      },
      {
        id: generateRandomAlphanumericId(16) as Wine["id"],
        name: "Wine 3" as Wine["name"],
        qty: 1 as Wine["qty"],
        quantity: 1 as number,
        actions: [] as ActionRelation[],
      },
    ],
    responsible: {
      id: generateRandomAlphanumericId(16),
      name: "John Doe",
      lastName: "Doe",
      email: "ZK4o7@example.com",
      role: "member",
      avatar: "",
      department: "wine-making",
      contactPhone: "",
      labData: [] as ActionRelation[],
    },
    lotId: generateRandomAlphanumericId(12),
    lotStatus: LotStatus.PLANNED,
    bottlingLine: "Line 2, Location 2",
    bottleType: "Bottle Type 2",
    bottleSize: 0.75,
    closureType: "Closure 2",
    capsuleType: "Capsule 2",
    labelType: "Label 2",
    bottleWeight: 150,
    packagingType: "6-pack Box",
    bottlesPerBox: 6,
    packagingMaterial: "Plastic",
    palletId: "Pallet 2",
    alcohol: 12.5,
    sugar: 10,
    pH: 7.5,
    totalSO2: 0.5,
    freeSO2: 0.3,
    turbidity: 0.2,
    labCertificateId: "Certificate 2",
    numberOfBottles: 1000,
    losses: 50,
    supportingDocuments: [] as {
      name: string;
      url: string;
    }[],
  },
  {
    id: Date.now().toString() + "3",
    executionDate: Timestamp.now(),
    name: "Collection 3", // Add this line
    group: ["Bottling Group 1", "Collection 3"], // Add this line
    rowType: "item",
    //
    type: null,
    collectionName: "Collection 3",
    vintage: "2023",
    wines: [
      {
        id: generateRandomAlphanumericId(16) as Wine["id"],
        name: "Wine 4" as Wine["name"],
        qty: 1 as Wine["qty"],
        quantity: 1 as number,
        actions: [] as ActionRelation[],
      },
    ],
    responsible: {
      id: generateRandomAlphanumericId(16),
      name: "John Doe",
      lastName: "Doe",
      email: "ZK4o7@example.com",
      role: "member",
      avatar: "",
      department: "wine-making",
      contactPhone: "",
      labData: [] as ActionRelation[],
    },
    lotId: generateRandomAlphanumericId(12),
    lotStatus: LotStatus.PLANNED,
    bottlingLine: "Line 3, Location 3",
    bottleType: "Bottle Type 3",
    bottleSize: 0.75,
    closureType: "Closure 3",
    capsuleType: "Capsule 3",
    labelType: "Label 3",
    bottleWeight: 150,
    packagingType: "6-pack Box",
    bottlesPerBox: 6,
    packagingMaterial: "Plastic",
    palletId: "Pallet 3",
    alcohol: 12.5,
    sugar: 10,
    pH: 7.5,
    totalSO2: 0.5,
    freeSO2: 0.3,
    turbidity: 0.2,
    labCertificateId: "Certificate 3",
    numberOfBottles: 1000,
    losses: 50,
    supportingDocuments: [] as {
      name: string;
      url: string;
    }[],
  },
  {
    id: Date.now().toString() + "4",
    executionDate: Timestamp.now(),
    name: "Collection 4", // Add this line
    group: ["Collection 4"], // Add this line
    rowType: "item",
    //
    type: null,
    collectionName: "Collection 4",
    vintage: "2023",
    wines: [
      {
        id: generateRandomAlphanumericId(16) as Wine["id"],
        name: "Wine 5" as Wine["name"],
        qty: 1 as Wine["qty"],
        quantity: 1 as number,
        actions: [] as ActionRelation[],
      },
    ],
    responsible: {
      id: generateRandomAlphanumericId(16),
      name: "John Doe",
      lastName: "Doe",
      email: "ZK4o7@example.com",
      role: "member",
      avatar: "",
      department: "wine-making",
      contactPhone: "",
      labData: [] as ActionRelation[],
    },
    lotId: generateRandomAlphanumericId(12),
    lotStatus: LotStatus.PLANNED,
    bottlingLine: "Line 4, Location 4",
    bottleType: "Bottle Type 4",
    bottleSize: 0.75,
    closureType: "Closure 4",
    capsuleType: "Capsule 4",
    labelType: "Label 4",
    bottleWeight: 150,
    packagingType: "6-pack Box",
    bottlesPerBox: 6,
    packagingMaterial: "Plastic",
    palletId: "Pallet 4",
    alcohol: 12.5,
    sugar: 10,
    pH: 7.5,
    totalSO2: 0.5,
    freeSO2: 0.3,
    turbidity: 0.2,
    labCertificateId: "Certificate 4",
    numberOfBottles: 1000,
    losses: 50,
    supportingDocuments: [] as {
      name: string;
      url: string;
    }[],
  },
];
