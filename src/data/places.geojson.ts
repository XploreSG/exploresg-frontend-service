export const places = {
  type: "FeatureCollection" as const,
  features: [
    {
      type: "Feature" as const,
      properties: {
        title: "Marina Bay Sands",
        description: "Iconic hotel with an infinity pool and observation deck.",
      },
      geometry: {
        type: "Point" as const,
        coordinates: [103.8601, 1.2834],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        title: "Gardens by the Bay",
        description:
          "Futuristic park with Supertree Grove and cooled conservatories.",
      },
      geometry: {
        type: "Point" as const,
        coordinates: [103.8636, 1.2816],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        title: "Singapore Flyer",
        description: "Giant observation wheel offering stunning city views.",
      },
      geometry: {
        type: "Point" as const,
        coordinates: [103.8632, 1.2893],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        title: "Merlion Park",
        description:
          "Home to the iconic Merlion statue, a symbol of Singapore.",
      },
      geometry: {
        type: "Point" as const,
        coordinates: [103.8545, 1.2868],
      },
    },
  ],
};
