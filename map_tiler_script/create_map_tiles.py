"""
Slightly stolen from https://stackoverflow.com/a/69498658/18947288
"""

from os import path, makedirs
from math import ceil

from PIL import Image
from PIL.Image import Resampling

def main():
  img_path = "map.png"
  output_dir = "./output/"
  tile_size = 2**8

  min_zoom = 0
  max_zoom = 6

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
    scaled_img = img.resize((scaled_w, scaled_h), Resampling.NEAREST)
    # scaled_img.save(path.join(z_output, "scaled.png"))
    print(f"zoom={zoom_lvl}, width={scaled_w}, height={scaled_h}")


    # Put the input image on a new image whose dimensions are multiples
    # of the tile dimensions so it can be sliced up cleanly.
    new_w = ceil(img_w / tile_size) * tile_size
    new_h = ceil(img_h / tile_size) * tile_size
    new_img = Image.new("RGB", (new_w, new_h), "black")

    paste_x = (new_w - img_w) // 2
    paste_y = (new_h - img_h) // 2
    new_img.paste(scaled_img, (paste_x, paste_y))

    for y in range(new_h // tile_size):
      for x in range(new_w // tile_size):
        x_output = path.join(z_output, str(x))
        if not path.isdir(x_output):
          makedirs(x_output)

        box = (x * tile_size, y * tile_size, x * tile_size +
               tile_size, y * tile_size + tile_size)
        tile_img = new_img.crop(box)
        tile_img.save(path.join(x_output, f"{y}.png"))


if __name__ == "__main__":
  main()
