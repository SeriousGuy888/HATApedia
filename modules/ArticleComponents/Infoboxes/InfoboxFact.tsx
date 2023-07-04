import { NextPage } from "next"

const InfoboxFact: NextPage<{
  title: string
  value: string | Array<string>
}> = ({ title, value }) => {
  return (
    <section className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-md p-4 print:border-b-black print:border-2">
      <div className="px-2 py-1">
        <p className="uppercase text-gray-600 dark:text-gray-300 print:text-black text-xs my-0">
          {title}
        </p>
        <span className="text-md text-black dark:text-white print:text-black my-0">
          {/*
            If the value is an array, render it as a ul,
            otherwise render it as a regular string.
          */}
          {value instanceof Array && value.length > 1 ? (
            <ul className="list-disc">
              {value.map((item) => (
                <li key={item} className="m-0">{item}</li>
              ))}
            </ul>
          ) : (
            value ?? "Unknown"
          )}
        </span>
      </div>
    </section>
  )
}

export default InfoboxFact
