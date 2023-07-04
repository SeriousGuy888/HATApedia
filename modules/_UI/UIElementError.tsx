import { NextPage } from "next"

const UIElementError: NextPage<{
  message: string
  codeBlock?: string
}> = ({ message, codeBlock }) => {
  return (
    <div
      className={`
        border-red-400
        bg-red-100 dark:bg-red-800
        text-black dark:text-white
        
        border-2 rounded-md
        my-12 p-4
      `}
    >
      <p className="font-sans m-0">{message}</p>
      {codeBlock && (
        <pre className="font-mono text-sm mt-4 mb-0">
          <code>{codeBlock}</code>
        </pre>
      )}
    </div>
  )
}

export default UIElementError
