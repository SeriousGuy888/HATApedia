import Head from "next/head"
import Image from "next/image"
import Link from "next/link"

const Home = () => {
  const links: { icon: string; name: string; path: string }[] = [
    {
      icon: "book.png",
      name: "Articles",
      path: "/articles",
    },
    {
      icon: "map.png",
      name: "World Map",
      path: "/map",
    },
    {
      icon: "fork.png",
      name: "Weather",
      path: "/weather",
    },
  ]

  return (
    <>
      <Head>
        <title>HATApedia</title>
      </Head>
      <article className="max-w-5xl w-full h-fit p-8">
        <h1 className="text-4xl mb-8">Welcome to HATApedia 🎉</h1>

        <div className="flex flex-wrap gap-4">
          {links.map((link) => (
            <Link
              href={link.path}
              key={link.path}
              className="flex-1 p-8 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 min-w-[15rem]"
            >
              <div className="grid grid-rows-[3fr_1fr] gap-4 text-center">
                <div className="relative w-full">
                  <Image
                    src={`/images/link_icons/${link.icon}`}
                    alt=""
                    fill
                    className="object-contain"
                    style={{
                      imageRendering: "pixelated",
                    }}
                  />
                </div>
                <h2 className="text-xl font-bold">{link.name}</h2>
              </div>
            </Link>
          ))}
        </div>
      </article>
    </>
  )
}

export default Home
