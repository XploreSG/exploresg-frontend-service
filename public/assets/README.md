# Singapore Pages Images

This directory contains all the images used in the Singapore pages (Attractions, Food & Dining, and Events).

## Directory Structure

```
public/assets/
├── attractions/          # Attraction images
├── food/                # Food & dining images  
├── events/              # Event images
└── README.md           # This file
```

## Required Images

### Attractions (`/assets/attractions/`)
- `marina-bay-sands.jpg` - Marina Bay Sands resort
- `gardens-by-the-bay.jpg` - Gardens by the Bay with Supertrees
- `sentosa-island.jpg` - Sentosa Island resort
- `singapore-zoo.jpg` - Singapore Zoo animals
- `chinatown.jpg` - Chinatown cultural district
- `singapore-flyer.jpg` - Singapore Flyer observation wheel
- `botanic-gardens.jpg` - Singapore Botanic Gardens
- `jewel-changi.jpg` - Jewel Changi Airport

### Food & Dining (`/assets/food/`)
- `maxwell-food-centre.jpg` - Maxwell Food Centre hawker
- `lau-pa-sat.jpg` - Lau Pa Sat hawker centre
- `jumbo-seafood.jpg` - Jumbo Seafood restaurant
- `katong-laksa.jpg` - 328 Katong Laksa stall
- `din-tai-fung.jpg` - Din Tai Fung restaurant
- `coconut-club.jpg` - The Coconut Club restaurant
- `zam-zam.jpg` - Zam Zam Restaurant
- `odette.jpg` - Odette fine dining

### Events (`/assets/events/`)
- `grand-prix.jpg` - Singapore Grand Prix F1 race
- `arts-festival.jpg` - Singapore Arts Festival
- `chinese-new-year.jpg` - Chinese New Year celebrations
- `food-festival.jpg` - Singapore Food Festival
- `music-festival.jpg` - Mosaic Music Festival
- `marathon.jpg` - Singapore Marathon
- `deepavali.jpg` - Deepavali Light-Up
- `night-festival.jpg` - Singapore Night Festival

## Image Specifications

- **Format**: JPG or PNG
- **Dimensions**: 800x600 pixels (4:3 aspect ratio)
- **Quality**: High resolution for web display
- **File Size**: Optimized for web (under 500KB each)

## Usage

Images are referenced in the React components using the `/assets/` path:

```jsx
image: "/assets/attractions/marina-bay-sands.jpg"
image: "/assets/food/maxwell-food-centre.jpg"
image: "/assets/events/grand-prix.jpg"
```

## Adding New Images

1. Add the image file to the appropriate directory
2. Update the corresponding page component with the new image path
3. Ensure the image follows the specifications above
4. Test the image displays correctly in the browser

## Notes

- All images should be appropriate and relevant to Singapore
- Images should be high quality and professional
- Consider using local Singapore photographers or stock photos
- Ensure all images are properly licensed for commercial use
