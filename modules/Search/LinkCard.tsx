import { NextPage } from "next"
import Link from "next/link"
import Image from "next/image"
import React from "react"

const LinkCard: NextPage<{
  title: string
  subtitle?: string
  description?: React.ReactNode
  imageSrc?: string
  link: string
}> = ({ title, subtitle, description, imageSrc, link }) => {
  return (
    <div
      className="max-w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 border-l-[12px] border-transparent hover:border-blue-500 hover:dark:border-blue-400 transition-colors cursor-pointer"
      title={title}
    >
      <Link className="flex flex-1 gap-4 justify-between h-full" href={link}>
        <div className="p-6 flex-[4] overflow-hidden [&>*]:overflow-ellipsis [&>*]:overflow-hidden">
          <h2 className="text-lg whitespace-nowrap">{title}</h2>
          <p
            className={
              "uppercase tracking-tight text-xs text-gray-500 dark:text-gray-400" +
              (description ? " whitespace-nowrap" : "")
            }
          >
            {subtitle ?? ""}
          </p>
          {description && (
            <p className="mt-3 text-xs min-h-[3em] text-gray-500 dark:text-gray-400">
              {description ?? ""}
            </p>
          )}
        </div>
        {imageSrc && (
          <div className="flex-[2] bg-slate-200 dark:bg-slate-700 p-3 h-full max-w-[35%]">
            <div className="h-full w-full max-w-xs flex justify-center aspect-square">
              <Image
                src={imageSrc}
                alt=""
                width={128}
                height={128}
                className="object-contain rounded-md w-full"
              />
            </div>
          </div>
        )}
      </Link>
    </div>
  )
}

export default LinkCard
