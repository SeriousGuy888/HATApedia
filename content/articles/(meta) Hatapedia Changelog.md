# 2023-06-30

## Added callouts
> [!cite] Look
> it's a callout and i can easily add it to any article now


# 2023-06-03

## Added weather page
You can now see live weather updates from HATA at [/weather](/weather)! (Currently only displays Forgsville, Remy Republic).
- Supports switching between viewing temperatures as Celsius & Kelvin
- Allows user to click the download button & export the weather card as an image

# 2023-05-29

## Added button to toggle table of contents on mobile
There is now a floating button in the bottom right that you can tap while browsing the site on a small-screened device, which allows you to access the table of contents (which was previously hidden on mobile).

# 2023-04-28

## Improved [World Map Viewer](/map)
The map is no longer blurry up close! You can see each individual block as an individual pixel.

Spy on Tobytopia in high resolution!

> The Python script used for generating the map now puts the entire original map image (10001x10001) onto a larger image whose dimensions are multiples of 256 (10240x10240) before slicing the tiles, allowing for no loss of detail. This is better than the previous method, which involved downscaling to (8192x8192). It also allows for a 1:1 correspondence between Minecraft world coordinates and coordinates on the map.

## Image Grouping
Images can now be grouped together in articles and be displayed in horizontal rows instead of each image being massive and taking up the entire width of the reading area.

> This took forever to make work right 😩. I hate writing Remark plugins.