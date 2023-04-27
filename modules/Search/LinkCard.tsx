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
      className="max-w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 hover:border-l-[12px] border-blue-500 dark:border-blue-400 transition-[border] cursor-pointer"
      title={title}
    >
      <Link className="flex flex-1 gap-4 justify-between h-full" href={link}>
        <div className="p-6 md:p-8 flex-[4] overflow-hidden [&>*]:overflow-ellipsis [&>*]:overflow-hidden">
          <h2 className="text-lg whitespace-nowrap">{title}</h2>
          <p className="uppercase tracking-tight text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {subtitle ?? ""}
          </p>
          <p className="mt-3 text-xs min-h-[3em] text-gray-500 dark:text-gray-400">
            {description ?? ""}
          </p>
        </div>
        {imageSrc && (
          <div className="flex-[2] bg-slate-200 dark:bg-slate-700 p-3 flex justify-center h-full aspect-square">
            <Image
              src={imageSrc}
              alt=""
              width={128}
              height={128}
              className="object-contain rounded-md w-full"
            />
          </div>
        )}
      </Link>
    </div>
  )
}

export default LinkCard
