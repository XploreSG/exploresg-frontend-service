/**
 * Fleet vehicle data catalog
 * This file contains the static vehicle configuration data
 * Can be replaced with data fetched from backend API
 */

import type { CarData } from "../services/mockFleetService";

/** Fleet vehicle catalog with predefined data */
export const CAR_DATA: CarData[] = [
  {
    file: "bmw-2.png",
    name: "BMW 2 Series",
    model: "218i Gran Coupé",
    numberPlate: "SGF1234A",
    status: "Available" as const,
  },
  {
    file: "bmw-440i.png",
    name: "BMW 4 Series",
    model: "440i Convertible",
    numberPlate: "SGFUN88B",
    status: "In Use" as const,
  },
  {
    file: "bmw-5-t.png",
    name: "BMW 5 Series",
    model: "520i",
    numberPlate: "SGMYCAR5C",
    status: "Maintenance" as const,
  },
  {
    file: "bmw-x3.png",
    name: "BMW X3",
    model: "xDrive30i",
    numberPlate: "SGAGENT7X",
    status: "Available" as const,
  },
  {
    file: "bmw-z4.png",
    name: "BMW Z4",
    model: "sDrive20i",
    numberPlate: "SGCOPILOT",
    status: "In Use" as const,
  },
  {
    file: "maserati-grecale.png",
    name: "Maserati Grecale",
    model: "GT",
    numberPlate: "SGHACKER",
    status: "Available" as const,
  },
  {
    file: "merc-sl63.png",
    name: "Mercedes-AMG SL",
    model: "SL 63",
    numberPlate: "SGEXPLORE",
    status: "In Use" as const,
  },
  {
    file: "merc-v.png",
    name: "Mercedes-Benz V-Class",
    model: "V 220 d",
    numberPlate: "SGAWESOME",
    status: "Maintenance" as const,
  },
  {
    file: "mini-cooper.png",
    name: "MINI Cooper",
    model: "3-Door",
    numberPlate: "SGFRIEND1",
    status: "Available" as const,
  },
  {
    file: "nissan-sentra.png",
    name: "Nissan Sentra",
    model: "SV",
    numberPlate: "SGFRIEND2",
    status: "In Use" as const,
  },
  {
    file: "peugeot-5008.png",
    name: "Peugeot 5008",
    model: "Allure",
    numberPlate: "SGBOSS",
    status: "Available" as const,
  },
  {
    file: "porsche-911-c.png",
    name: "Porsche 911",
    model: "Carrera",
    numberPlate: "SGFAST",
    status: "In Use" as const,
  },
  {
    file: "rr.png",
    name: "Rolls-Royce Ghost",
    model: "Black Badge",
    numberPlate: "SGEZ",
    status: "Maintenance" as const,
  },
  {
    file: "skoda-octavia.png",
    name: "Skoda Octavia",
    model: "RS",
    numberPlate: "SGPRO",
    status: "Available" as const,
  },
  {
    file: "vw-golf.png",
    name: "Volkswagen Golf",
    model: "GTI",
    numberPlate: "SGKING",
    status: "In Use" as const,
  },
  {
    file: "vw-polo.png",
    name: "Volkswagen Polo",
    model: "Life",
    numberPlate: "SGRIDER",
    status: "Available" as const,
  },
];
