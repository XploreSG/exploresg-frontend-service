docker run -d \
  --name prod-exploresg-frontend-service \
  -p 3000:3000 \
  --env-file ./frontend.env \
  sreerajrone/exploresg-frontend-service
