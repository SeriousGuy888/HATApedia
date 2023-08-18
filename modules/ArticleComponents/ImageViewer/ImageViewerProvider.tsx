import { NextPage } from "next"
import { createContext, useMemo, useState } from "react"

export const ImageViewerContext = createContext<{
  image: HTMLImageElement | null
  setImage: React.Dispatch<React.SetStateAction<HTMLImageElement | null>>
}>({
  image: null,
  setImage: () => {},
})

// Define your provider component
export const ImageViewerProvider: NextPage<{
  children: React.ReactNode
}> = ({ children }) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const providerValue = useMemo(() => ({ image, setImage }), [image, setImage])

  return (
    <ImageViewerContext.Provider value={providerValue}>
      {children}
    </ImageViewerContext.Provider>
  )
}
