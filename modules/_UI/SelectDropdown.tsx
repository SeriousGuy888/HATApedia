import { NextPage } from "next"
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded"
import UIElementError from "./UIElementError"

interface Props {
  options: {
    [id: string]: string
  }
  selectedOption: string
  setSelectedOption: Function
}

const SelectDropdown: NextPage<Props> = ({
  options,
  selectedOption,
  setSelectedOption,
}) => {
  if (!options || !selectedOption || !setSelectedOption) {
    return (
      <UIElementError message={"Missing props for SelectDropdown!"} />
    )
  }

  return (
    <div className="relative @container-normal/dropdown">
      <select
        className={`
          w-full h-full
          py-2 px-4 rounded-xl
          appearance-none
          focus:outline-none focus:ring-2 focus:border-blue-800
          
          bg-gray-200 dark:bg-gray-700
          border-2 border-gray-300 dark:border-gray-600
        `}
        value={selectedOption}
        onChange={(e) => {
          setSelectedOption(e.target.value)
        }}
      >
        {Object.keys(options).map((id) => {
          return (
            <option key={id} value={id}>
              {options[id]}
            </option>
          )
        })}
      </select>
      <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <ExpandMoreRoundedIcon fontSize="medium" />
      </span>
    </div>
  )
}

export default SelectDropdown
