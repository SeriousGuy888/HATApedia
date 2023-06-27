import { NextPage } from "next"

const UIElementError: NextPage<{ message: string }> = ({ message }) => {
  return (
    <p
      className={`
        border-red-400
        bg-red-100 dark:bg-red-800
        text-black dark:text-white
        
        border-2 text-sm rounded-md
        font-mono
        p-4 my-12
      `}
    >
      {message}
    </p>
  )
}

export default UIElementError
