"""
Takes the image that contains the map in it and splits it up into bite-sized
pre-rendered tiles that can be loaded through Leaflet in the interactive map.

(Partially stolen from https://stackoverflow.com/a/69498658/18947288)
"""

from os import path, makedirs
from math import ceil

from PIL import Image
from PIL.Image import Resampling


def main():
  img_path = "map.png"
  output_dir = "../public/map_tile/"
  tile_size = 256

  min_zoom = 1
  max_zoom = 5

  img = Image.open(img_path)
  img_w, img_h = img.size
  max_side = max(img_w, img_h)

  for zoom_lvl in range(min_zoom, max_zoom + 1):
    z_output = path.join(output_dir, str(zoom_lvl))
    if not path.isdir(z_output):
      makedirs(z_output)

    tile_size_at_zoom_lvl = tile_size * (2 ** zoom_lvl)
    scale_ratio = tile_size_at_zoom_lvl / max_side
    scaled_w = int(img_w * scale_ratio)
    scaled_h = int(img_h * scale_ratio)
    scaled_img = img.resize((scaled_w, scaled_h), Resampling.BICUBIC)
    print(f"zoom={zoom_lvl}, width={scaled_w}, height={scaled_h}")

    # Put the input image on a new image whose dimensions are multiples
    # of the tile dimensions so it can be sliced up cleanly.
    new_w = ceil(scaled_w / tile_size) * tile_size
    new_h = ceil(scaled_h / tile_size) * tile_size
    new_img = Image.new("RGB", (new_w, new_h), "black")

    paste_x = (new_w - scaled_w) // 2
    paste_y = (new_h - scaled_h) // 2
    # print(paste_x, paste_y)
    new_img.paste(scaled_img, (paste_x, paste_y))
    # scaled_img.save(path.join(z_output, "scaled.png"))
    # new_img.save(path.join(z_output, "goodified.png"))

    tile_x, tile_y = 0, 0
    for y in range(0, new_h, tile_size):
      for x in range(0, new_w, tile_size):
        x_output = path.join(z_output, str(tile_x))
        if not path.isdir(x_output):
          makedirs(x_output)

        box = (x, y, x + tile_size, y + tile_size)
        tile_img = new_img.crop(box)
        tile_img.save(path.join(x_output, f"{tile_y}.png"))

        tile_x += 1
      tile_x = 0
      tile_y += 1


if __name__ == "__main__":
  main()
