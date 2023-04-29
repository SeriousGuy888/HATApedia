# 2023-04-28

## Improved [World Map Viewer](/map)
The map is no longer blurry up close! You can see each individual block as an individual pixel.

Spy on Tobytopia in high resolution!

> The Python script used for generating the map now puts the entire original map image (10001x10001) onto a larger image whose dimensions are multiples of 256 (10240x10240) before slicing the tiles, allowing for no loss of detail. This is better than the previous method, which involved downscaling to (8192x8192). It also allows for a 1:1 correspondence between Minecraft world coordinates and coordinates on the map.