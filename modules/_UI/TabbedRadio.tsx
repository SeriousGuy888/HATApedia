import { NextPage } from "next"
import UIElementError from "./UIElementError"

interface Props {
  options: {
    [id: string]: string
  }
  selectedOption: string
  setSelectedOption: Function
}

const TabbedRadio: NextPage<Props> = ({
  options,
  selectedOption,
  setSelectedOption,
}) => {
  if (!options || !selectedOption || !setSelectedOption) {
    return <UIElementError message={"Missing props for TabbedRadio!"} />
  }

  return (
    <ul
      className={`
        flex text-center
        rounded-xl
        text-black dark:text-white
        bg-gray-200 dark:bg-gray-700

        divide-x-2 divide-gray-300 dark:divide-gray-600
        border-2 border-gray-300 dark:border-gray-600

        overflow-clip
      `}
    >
      {Object.keys(options).map((id) => {
        return (
          <li
            key={id}
            className={`w-full ${
              selectedOption === id ? "bg-blue-800 font-bold text-white" : ""
            }`}
          >
            <button
              className="w-full h-full p-2"
              onClick={() => setSelectedOption(id)}
            >
              {options[id]}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default TabbedRadio
