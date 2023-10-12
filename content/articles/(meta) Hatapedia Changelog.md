---
date_created: 2023-05-01
date_modified: 2023-10-12
---

# 2023-09-10

## Added Ctrl+K to Search

You can now press <kbd>Ctrl</kbd><kbd>K</kbd> to bring up a search pallette that allows you to search for articles by their title.

# 2023-08-18

## Added Inline Image Viewer

You can now click on images in articles to view them in a larger size without leaving the page. The previewer also displays the alt text as a description of the image below the image itself.

You can still view the original by clicking the `View Original` link.

![[Remy Portrait.png|A portrait of RemyHemy, the Glorious Leader of the Remy Republic and former captain of the Flagrant Fowls bobble league team.]]

# 2023-07-19

## Added Backlinks

Articles on HATApedia are extensively hyperlinked together. Now, you will find a section at the bottom of each article with links to articles that have links to it. This allows for easier navigation between related topics.

# 2023-07-05

## Added Timeline Component

I've replaced the timeline page I've been working on with a timeline component that can go in any article.

```infobox-timeline
title: Example Timeline
events:
- title: So beas an exemplar event
  description: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
  image: "[[epic hata logo.png]]"
  colour: "#900"
  date:
    start: 2023-01-15
    end: 2023-06-01
- title: So zel beas an exemplar event
  date:
    start: 2023-06-02
    end: 2023-08-12
- title: So event beas in an else lane
  lane: 20
  date:
    start: 2023-02-10
    end: 2023-07-01
- title: Shu vyu
  lane: 30
  image: "[[remy struck by missile while jasper aims his bow, wearing toby's drip.png]]"
  color: "#900"
  date:
    start: 2023-01-10
    end: 2023-02-02
```

# 2023-07-04

## Improved Nation Infoboxes

Nation infoboxes are no longer tied to articles. I've managed to write some code to allow myself to use them anywhere in the articles. I can even use them here!

```infobox-nation
name: "Hatapedia"
banner: "[[epic hata logo.png]]"
facts:
  example fact: Example Fact
  author: Billzo
```

## Character Infoboxes

Infoboxes for humans and [[The Voices|voices]] alike:

```infobox-character
name: Doctor Zomboss
image: "[[Zomboss Eliminated.png]]"
facts:
  status: Dead
```

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