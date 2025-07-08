import { Timestamp } from "firebase/firestore";
import { TeamMember, Vineyard } from "./db";

export const ParcelClassification = {
  WINE_PDO: "vinuri cu DOP", //"Wines with Protected Designation of Origin"
  WINE_PGI: "vinuri cu IGP", // "Wines with Protected Geographical Indication"
  WINE_VARIETY_GENERIC: "vinuri din soiuri fără DOP/IGP",
  WINE_GENERIC: "vinuri fără DOP/IGP",
  OTHER_DESTINATIONS: "alte destinatii",
} as const;

export type ParcelClassification =
  (typeof ParcelClassification)[keyof typeof ParcelClassification];

export const GrapeDestination = {
  WINE: "Vinificati",
  DELIVERED: "Livrati unei cooperative vinicole",
  SOLD: "Vinduti unui vinificator",
  OTHER: "Alte Destinatii",
} as const;

export type GrapeDestination =
  (typeof GrapeDestination)[keyof typeof GrapeDestination];

interface BaseDestination {
  id: string;
  parcelClassification: ParcelClassification;
  grapeDestination:
    | WineDestinationType
    | DeliveredDestinationType
    | SoldDestinationType
    | OtherDestinationType;
}

type WineDestinationType = "Vinificati";
type DeliveredDestinationType = "Livrati unei cooperative vinicole";
type SoldDestinationType = "Vinduti unui vinificator";
type OtherDestinationType = "Alte Destinatii";

interface WineDestination extends BaseDestination {
  grapeDestination: WineDestinationType;
  qty: number;
  unit: "tone";
}

interface OtherGrapeDestination extends BaseDestination {
  grapeDestination:
    | DeliveredDestinationType
    | SoldDestinationType
    | OtherDestinationType;
  grapesUnit: "tone";
  grapesQty: number;
  mustUnit: "dal";
  mustVol: number;
}

/*export type Destination = {
  id: string;
  parcelClassification: ParcelClassification;
} & (WineDestination | OtherGrapeDestination);*/

export type Destination = {
  id: string;
  parcelClassification: ParcelClassification;
  grapeDestination: GrapeDestination;
  // if grapeDestination === WINE
  unit?: "tone" | "string";
  qty?: number;
  // else
  grapesUnit?: "tone" | "string";
  grapesQty?: number;
  mustUnit?: "dal" | "string";
  mustVol?: number;
};

export type Anexa14Data = {
  id: string;
  declarant: {
    name?: string;
    wineRegisterUniqueId?: string;
    identityCardNo?: string;
    address?: string;
    telFax?: string;
  };
  harvest: {
    unit?: "ha" | string;
    totalVineyardsArea?: number; // sum Vineyard["info"]["location"]["surface"]
    freshConsumption?: number;
  };
  parcelVineyards?: Array<ReducedVineyard>;
  modifications?: Array<Partial<Pick<Anexa14Data, "declarant" | "harvest">>>;
  createdAt: string | Timestamp;
  createdBy: TeamMember["id"] | TeamMember["email"];
  modifiedAt?: string | Timestamp;
  modifiedBy?: TeamMember["id"] | TeamMember["email"];
  date?: string | Timestamp;
};

export interface ReducedVineyard {
  id: string;
  vineyardId: Vineyard["id"];
  name?: Vineyard["name"];
  surface: Vineyard["info"]["location"]["surface"];
  parcelCode?: string;
  grapeVariety?: Vineyard["grapeVariety"];
  totalHarvestedQty?: number; // actual qty from Vineyard["batches"]
  unit?: "tone" | string;
  parcelClassification: ParcelClassification;
  totalHarvestedQtyWhite?: number;
  wine?: number;
  wineWhite?: number;
  delivered?: number;
  deliveredWhite?: number;
  deliveredMust?: number;
  deliveredMustWhite?: number;
  sold?: number;
  soldWhite?: number;
  soldMust?: number;
  soldMustWhite?: number;
  other?: number;
}
