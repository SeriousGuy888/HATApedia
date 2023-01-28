import React, { useCallback, useState } from "react"
import styles from "./WorldMap.module.scss"

// https://github.com/alephart/react-image-zoom-pan/blob/master/src/PinchZoomPan.js

interface XY {
  x: number
  y: number
}

const WorldMap = () => {
  const [offset, setOffset] = useState<XY>({ x: 0, y: 0 })
  const [dragStartPos, setDragStartPos] = useState<XY>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(100)

  // ------

  const handleDragStart = useCallback((e: React.DragEvent) => {
    e.dataTransfer.setDragImage(new Image(), 0, 0)

    setDragStartPos(getEventXY(e))
  }, [])

  const handleDragEnd = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
    },
    [dragStartPos],
  )

  const handleDrag = useCallback(
    (e: React.DragEvent) => {
      if (e.clientX === 0 && e.clientY === 0) return
      const currPos = getEventXY(e)
      const diff = {
        x: currPos.x - dragStartPos.x,
        y: currPos.y - dragStartPos.y,
      }
      // console.log(diff)
      // setOffset(diff)
      setOffset({
        x: offset.x + diff.x,
        y: offset.y + diff.y,
      })
    },
    [dragStartPos],
  )

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      const delta = Math.max(Math.min(e.deltaY, 1), -1)

      // const mousePos = getEventXY(e)
      // const zoomPoint: XY = {
      //   x: (offset.x + mousePos.x) / zoom,
      //   y: (offset.y + mousePos.y) / zoom,
      // }

      changeZoom(-delta * 7)

      // const newOffset: XY = {
      //   x: (zoomPoint.x * ((zoom + changeInZoom) / 100)) - offset.x,
      //   y: (zoomPoint.y * ((zoom + changeInZoom) / 100)) - offset.y,
      // }

      // setOffset(newOffset)
    },
    [zoom, offset],
  )

  // ------

  const getEventXY = useCallback((e: React.MouseEvent): XY => {
    const rect = (e.target as Element).getBoundingClientRect()

    // if (e.clientX === 0 && e.clientY === 0) {
    //   return null
    // }

    return {
      x: e.clientX - Math.round(rect.left),
      y: e.clientY - Math.round(rect.top),
    }
  }, [])

  const zoomOut = useCallback(() => changeZoom(-10), [zoom])
  const zoomIn = useCallback(() => changeZoom(10), [zoom])
  const changeZoom = useCallback(
    (percentage: number) => {
      const newZoom = Math.max(Math.min(zoom + percentage, 500), 100)
      setZoom(newZoom)
    },
    [zoom, offset],
  )

  const mapLayerStyles = {
    backgroundSize: `${zoom}%`,
    backgroundPositionX: offset.x,
    backgroundPositionY: offset.y,
  }

  return (
    <>
      <p>
        offset: {offset.x}, {offset.y}
        <br />
        drag start: {dragStartPos.x}, {dragStartPos.y}
      </p>
      <section style={{ width: "65vmin", height: "65vmin", marginTop: "2rem" }}>
        <div
          draggable
          onDrag={handleDrag}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onWheel={handleWheel}
          style={{
            height: "100%",
            width: "100%",
            cursor: "grab",
            position: "relative",
          }}
        >
          <div
            className={styles.mapImage}
            style={{
              ...mapLayerStyles,
              backgroundImage: `url("/images/map/Terrain.png")`,
              zIndex: 0,
            }}
          />
          <div
            className={styles.mapImage}
            style={{
              ...mapLayerStyles,
              backgroundImage: `url("/images/map/Territories.png")`,
              zIndex: 1,
              opacity: 0.75,
            }}
          />
        </div>
      </section>
      <button onClick={zoomOut}>meow</button>
      <button onClick={zoomIn}>woof</button>
    </>
  )
}

export default WorldMap
