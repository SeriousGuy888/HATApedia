import { NextPage } from "next"

const UIElementError: NextPage<{ message: string }> = ({ message }) => {
  return (
    <p className="bg-red-300 text-black dark:bg-red-500 dark:text-white font-bold text-sm rounded-xl p-4">
      {message}
    </p>
  )
}

export default UIElementError
