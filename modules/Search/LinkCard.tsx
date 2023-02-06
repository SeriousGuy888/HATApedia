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
      className="max-w-full overflow-hidden rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
      title={title}
    >
      <Link className="flex flex-1 gap-4 justify-between px-8 py-4" href={link}>
        <div className="flex-[4] overflow-x-hidden py-4 [&>*]:overflow-ellipsis [&>*]:overflow-hidden">
          <h2 className="text-lg whitespace-nowrap">{title}</h2>
          {subtitle && (
            <p className="uppercase tracking-tight text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
              {subtitle}
            </p>
          )}
          {description && (
            <>
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                {description}
              </p>
            </>
          )}
        </div>
        {imageSrc && (
          <div className="flex-[2] bg-slate-200 dark:bg-slate-700 rounded-md min-h-[8rem] p-2">
            <div className="relative w-full h-full">
              <Image src={imageSrc} alt="" fill className="object-contain" />
            </div>
          </div>
        )}
      </Link>
    </div>
  )
}

export default LinkCard
