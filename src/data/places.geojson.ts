export const places = {
  type: "FeatureCollection" as const,
  features: [
    // Marina Bay Area
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

    // Central Singapore
    {
      type: "Feature" as const,
      properties: {
        title: "Orchard Road",
        description:
          "Premier shopping district with luxury malls and boutiques.",
      },
      geometry: {
        type: "Point" as const,
        coordinates: [103.8198, 1.3048],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        title: "Singapore Botanic Gardens",
        description:
          "UNESCO World Heritage tropical garden with National Orchid Garden.",
      },
      geometry: {
        type: "Point" as const,
        coordinates: [103.815, 1.3138],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        title: "Clarke Quay",
        description:
          "Historic riverside district with restaurants and nightlife.",
      },
      geometry: {
        type: "Point" as const,
        coordinates: [103.8467, 1.2887],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        title: "Raffles Hotel",
        description: "Colonial-era luxury hotel and Singapore landmark.",
      },
      geometry: {
        type: "Point" as const,
        coordinates: [103.8544, 1.2947],
      },
    },

    // Chinatown & Tanjong Pagar
    {
      type: "Feature" as const,
      properties: {
        title: "Chinatown",
        description:
          "Historic ethnic district with temples, markets, and heritage shops.",
      },
      geometry: {
        type: "Point" as const,
        coordinates: [103.8439, 1.2812],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        title: "Buddha Tooth Relic Temple",
        description: "Buddhist temple and museum in the heart of Chinatown.",
      },
      geometry: {
        type: "Point" as const,
        coordinates: [103.8445, 1.2815],
      },
    },

    // Little India & Kampong Glam
    {
      type: "Feature" as const,
      properties: {
        title: "Little India",
        description:
          "Vibrant ethnic quarter with colorful shops and authentic Indian cuisine.",
      },
      geometry: {
        type: "Point" as const,
        coordinates: [103.851, 1.3067],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        title: "Sultan Mosque",
        description:
          "Historic mosque and centerpiece of the Kampong Glam district.",
      },
      geometry: {
        type: "Point" as const,
        coordinates: [103.859, 1.3024],
      },
    },

    // Sentosa Island
    {
      type: "Feature" as const,
      properties: {
        title: "Universal Studios Singapore",
        description:
          "Movie-themed amusement park with thrilling rides and shows.",
      },
      geometry: {
        type: "Point" as const,
        coordinates: [103.8238, 1.254],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        title: "S.E.A. Aquarium",
        description:
          "One of the world's largest aquariums with diverse marine life.",
      },
      geometry: {
        type: "Point" as const,
        coordinates: [103.8205, 1.2588],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        title: "Siloso Beach",
        description:
          "Popular beach destination with water sports and beach bars.",
      },
      geometry: {
        type: "Point" as const,
        coordinates: [103.8115, 1.2485],
      },
    },

    // East Singapore
    {
      type: "Feature" as const,
      properties: {
        title: "East Coast Park",
        description:
          "Seaside park perfect for cycling, barbecues, and water sports.",
      },
      geometry: {
        type: "Point" as const,
        coordinates: [103.9098, 1.301],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        title: "Changi Airport Jewel",
        description:
          "Shopping and entertainment complex with the world's tallest indoor waterfall.",
      },
      geometry: {
        type: "Point" as const,
        coordinates: [103.9915, 1.3592],
      },
    },

    // West Singapore
    {
      type: "Feature" as const,
      properties: {
        title: "Jurong Bird Park",
        description:
          "World-renowned bird park with over 5,000 birds from 400 species.",
      },
      geometry: {
        type: "Point" as const,
        coordinates: [103.7065, 1.3189],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        title: "Singapore Science Centre",
        description:
          "Interactive science museum with hands-on exhibits and planetarium.",
      },
      geometry: {
        type: "Point" as const,
        coordinates: [103.7352, 1.3359],
      },
    },

    // North Singapore
    {
      type: "Feature" as const,
      properties: {
        title: "Singapore Zoo",
        description: "Award-winning open-concept zoo with over 2,800 animals.",
      },
      geometry: {
        type: "Point" as const,
        coordinates: [103.793, 1.4043],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        title: "Night Safari",
        description:
          "World's first nocturnal zoo showcasing animals in their natural habitat.",
      },
      geometry: {
        type: "Point" as const,
        coordinates: [103.7894, 1.4022],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        title: "Woodlands Waterfront Park",
        description:
          "Scenic waterfront park with views of Malaysia across the Johor Strait.",
      },
      geometry: {
        type: "Point" as const,
        coordinates: [103.7867, 1.4483],
      },
    },

    // Additional Popular Spots
    {
      type: "Feature" as const,
      properties: {
        title: "Haw Par Villa",
        description:
          "Unique theme park featuring Chinese mythology and folklore.",
      },
      geometry: {
        type: "Point" as const,
        coordinates: [103.7825, 1.2838],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        title: "MacRitchie Reservoir",
        description: "Nature reserve with treetop walk and hiking trails.",
      },
      geometry: {
        type: "Point" as const,
        coordinates: [103.8192, 1.352],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        title: "Esplanade Theatres",
        description: "Iconic performing arts center known as 'The Durian'.",
      },
      geometry: {
        type: "Point" as const,
        coordinates: [103.8552, 1.2897],
      },
    },
  ],
};
