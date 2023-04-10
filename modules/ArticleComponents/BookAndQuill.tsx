import { NextPage } from "next"
import Image from "next/image"
import localFont from "@next/font/local"
import { useEffect, useRef, useState } from "react"

const minecraftFont = localFont({
  src: "../../public/fonts/minecraftia-webfont.woff",
})
const BookAndQuill: NextPage = () => {
  const [page, setPage] = useState(1)
  const gotoPrevPage = () => {
    if (page === 1) {
      return
    }
    setPage((p) => p - 1)
  }
  const gotoNextPage = () => {
    setPage((p) => p + 1)
  }

  const bookContainer = useRef<HTMLDivElement>(null)
  const [fontSize, setFontSize] = useState(18)

  useEffect(() => {
    if (bookContainer.current) {
      new ResizeObserver(() => {
        const containerHeight = bookContainer.current!.clientHeight
        setFontSize((6.5 / 180) * containerHeight)
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
        <p className="m-0">Page {page} of 8</p>
      </div>
      <div className="absolute left-[11%] top-[16.1%] z-20 w-[78.1%] [&>*]:m-0 leading-tight">
        <p>
          Cillum eiusmod incididunt pariatur eu sint reprehenderit. Ipsum est
          ipsum non magna magna ad in. Deserunt fugiat ad do exercitation non
          cupidatat aute sint. Elit incididunt anim culpa deserunt veniam
          proident amet irure proident voluptate velit aliquip officia ea. Ad
          pariatur minim in duis aliqua occaecat id id. Officia dolore veniam
          velit magna. Proident et officia exercitation labore laborum culpa
          exercitation. Pariatur cillum quis fugiat ut do. Labore fugiat ipsum
          consectetur laborum.
        </p>
      </div>
    </div>
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
