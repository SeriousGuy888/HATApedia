"""
Takes the image that contains the map in it and splits it up into bite-sized
pre-rendered tiles that can be loaded through Leaflet in the interactive map.

(Partially stolen from https://stackoverflow.com/a/69498658/18947288)
"""

from os import path, makedirs
from math import ceil

from PIL import Image
from PIL.Image import Resampling

from tqdm import tqdm


def main():
  img_path = "map.png"
  output_dir = "../public/map_tile/"

  # the dimensions for each of the individual tiles;
  # not related to the dimensions of the input image
  tile_size = 256

  # the zoom levels to create tiles for
  min_zoom = 1
  max_zoom = 5

  in_img = Image.open(img_path)
  in_img_w, in_img_h = in_img.size

  ##############################

  """
  Create a new image whose dimensions are some multiple of the tile_size
  and greater than or equal to the input image's dimensions.
  Then, paste the input image into the center of the new image.
  This is so that the input image can be sliced up cleanly into tiles.
  """

  img_w = ceil(in_img_w / tile_size) * tile_size
  img_h = ceil(in_img_h / tile_size) * tile_size
  new_img = Image.new("RGB", (img_w, img_h), "black")

  paste_x = (img_w - in_img_w) // 2
  paste_y = (img_h - in_img_h) // 2
  new_img.paste(in_img, (paste_x, paste_y))

  ##############################

  for zoom_lvl in range(min_zoom, max_zoom + 1):
    # what directory for this zoom level
    z_output = path.join(output_dir, str(zoom_lvl))
    if not path.isdir(z_output):
      makedirs(z_output)

    dim_divisor = 2 ** (max_zoom - zoom_lvl)
    scaled_w = img_w // dim_divisor
    scaled_h = img_h // dim_divisor
    scaled_img = new_img.resize((scaled_w, scaled_h), Resampling.BICUBIC)
    print(
        f"\nSlicing tiles for zoom level {zoom_lvl}, from image with dimensions {scaled_img.size}...")

    tile_x, tile_y = 0, 0
    for y in tqdm(range(0, scaled_h, tile_size), desc="Columns", unit="col"):
      for x in range(0, scaled_w, tile_size):
        x_output = path.join(z_output, str(tile_x))
        if not path.isdir(x_output):
          makedirs(x_output)

        box = (x, y, x + tile_size, y + tile_size)
        tile_img = scaled_img.crop(box)
        tile_img.save(path.join(x_output, f"{tile_y}.png"))

        tile_x += 1
      tile_x = 0
      tile_y += 1


if __name__ == "__main__":
  main()
