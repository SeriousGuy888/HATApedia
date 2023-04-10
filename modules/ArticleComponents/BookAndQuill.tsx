import { NextPage } from "next"
import Image from "next/image"
import localFont from "@next/font/local"
import { useEffect, useRef, useState } from "react"

const minecraftFont = localFont({
  src: "../../public/fonts/minecraftia-webfont.woff",
})
const BookAndQuill: NextPage<{ pagesData: string[] }> = ({ pagesData }) => {
  const [page, setPage] = useState(1)
  const maxPage = pagesData.length

  const gotoPrevPage = () => {
    if (page === 1) {
      return
    }
    setPage((p) => p - 1)
  }
  const gotoNextPage = () => {
    if (page === maxPage) {
      return
    }
    setPage((p) => p + 1)
  }

  const getCurrPageData = () => JSON.parse(pagesData[page - 1])

  const bookContainer = useRef<HTMLDivElement>(null)
  const [fontSize, setFontSize] = useState(18)

  useEffect(() => {
    if (bookContainer.current) {
      new ResizeObserver(() => {
        const containerHeight = bookContainer.current!.clientHeight
        setFontSize((6.25 / 180) * containerHeight)
      }).observe(bookContainer.current)
    }
  }, [])

  return (
    <div
      className="relative text-black"
      style={{
        imageRendering: "pixelated",
        fontFamily: minecraftFont.style.fontFamily,
        fontSize: `${fontSize}px`,
      }}
      onResizeCapture={() => {
        console.log("resize")
      }}
      ref={bookContainer}
    >
      <BackgroundAndControls
        prevPageFn={gotoPrevPage}
        nextPageFn={gotoNextPage}
      />
      <div className="absolute right-[13.7%] top-[8.3%] z-30 text-right">
        <p className="m-0">
          Page {page} of {maxPage}
        </p>
      </div>
      <div className="absolute left-[11%] top-[16.1%] z-20 w-[78.1%] [&>*]:m-0 leading-tight break-words">
        <MinecraftTextRenderer textData={getCurrPageData()} />
      </div>
    </div>
  )
}

interface MinecraftTextComponent {
  text?: string
  color?: string
  bold?: boolean
  italic?: boolean
  underlined?: boolean
  strikethrough?: boolean
  obfuscated?: boolean
}

const MinecraftTextRenderer: NextPage<{
  textData: MinecraftTextComponent | MinecraftTextComponent[]
}> = ({ textData }) => {
  // https://minecraft.fandom.com/wiki/Raw_JSON_text_format#Java_Edition

  if (!Array.isArray(textData)) {
    textData = [textData]
  }

  return (
    <>
      {textData.map((textComponent, i) => {
        const lines = textComponent.text?.split("\n")
        if (!lines) {
          return <p key={i}></p> // NOSONAR
        }

        return (
          <span
            key={i} // NOSONAR
            style={{
              color: textComponent.color ?? "black",
              fontWeight: textComponent.bold ? "bold" : "normal",
              fontStyle: textComponent.italic ? "italic" : "normal",
              textDecoration: textComponent.underlined ? "underline" : "none",
              textDecorationLine: textComponent.strikethrough
                ? "line-through"
                : "none",
              textShadow: textComponent.obfuscated ? "0 0 5px black" : "none",
            }}
          >
            {lines.map((value, i) => (
              <>
                {value}
                {i !== lines.length - 1 && <br />}
              </>
            ))}
          </span>
        )
      })}
    </>
  )
}

const BackgroundAndControls: NextPage<{
  prevPageFn: Function
  nextPageFn: Function
}> = ({ prevPageFn: prevPage, nextPageFn: nextPage }) => {
  const imageUrls = {
    page: "/images/book_and_quill/page.png",
    prev: "/images/book_and_quill/prev.png",
    prevHover: "/images/book_and_quill/prev_hover.png",
    next: "/images/book_and_quill/next.png",
    nextHover: "/images/book_and_quill/next_hover.png",
  }

  const [prevBtnSrc, setPrevBtnSrc] = useState(imageUrls.prev)
  const [nextBtnSrc, setNextBtnSrc] = useState(imageUrls.next)

  return (
    <div className="aspect-[146/180] w-full relative [&>img]:absolute [&>img]:m-0">
      <Image
        src={imageUrls.page}
        alt=""
        width={146}
        height={180}
        className="w-full top-0 left-0 z-10"
      />
      <Image
        src={prevBtnSrc}
        alt="Previous Page"
        width={18}
        height={10}
        className="z-30 left-[17.8%] top-[87.8%] w-[10%]"
        onMouseEnter={() => {
          setPrevBtnSrc(imageUrls.prevHover)
        }}
        onMouseLeave={() => {
          setPrevBtnSrc(imageUrls.prev)
        }}
        onClick={() => {
          prevPage()
        }}
      />
      <Image
        src={nextBtnSrc}
        alt="Next Page"
        width={18}
        height={10}
        className="z-30 left-[67.9%] top-[87.8%] w-[10%]"
        onMouseEnter={() => {
          setNextBtnSrc(imageUrls.nextHover)
        }}
        onMouseLeave={() => {
          setNextBtnSrc(imageUrls.next)
        }}
        onClick={() => {
          nextPage()
        }}
      />
    </div>
  )
}

export default BookAndQuill
