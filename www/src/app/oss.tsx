import Link from "next/link";

export function JumbaOpenSource() {
  const oss = [
    {
      title: "Amplify Access Analzer",
      description:
        "A package to help you automate the creation of an Access Analyzer for dyamically testing your AppSync APIs security",
      href: "https://www.npmjs.com/package/@jumba/access-analyzer",
    },
    {
      title: "Amplify + Next.js v13",
      description:
        "A collection of delightful hooks and utilities for using Amplify with Next.js (app directory)",
      href: "https://www.npmjs.com/package/@jumba/amplify-nextjs",
    },
  ];

  return (
    <div className="p-10 mx-auto max-w-6xl">
      <h3 className="text-4xl font-medium mb-5">Jumba Open Source</h3>
      <p className="text-xl max-w-3xl text-gray-500">
          We use a lot of open source software at Jumba and we believe in
          contributing back to the community as much as we can. Some of the 
          projects we have created or have contributed to are listed below.
      </p>
      <section className="my-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        {oss.map((project) => (
          <Link
            key={project.title}
            href={project.href}
            className={`rounded-xl transition-all bg-gray-600/20 hover:bg-gradient-to-tr hover:animate-pulse from-yellow-400 to-orange-500 via-pink-500 p-[1px] cursor-pointer`}
          >
            <div className="rounded-xl bg-background flex flex-col gap-5 p-8 py-10">
              <h4 className="text-xl mb-3">{project.title}</h4>
              <p className="text-gray-400 text-lg line-clamp-3">
                {project.description}
              </p>
            </div>
          </Link>
        ))}
        <div
          className={`rounded-xl bg-gradient-to-tr animate-pulse from-yellow-400 to-orange-500 via-pink-500 p-[1px]`}
        >
          <div className="rounded-xl bg-background flex flex-col gap-5 p-8 py-10">
            <h4 className="text-xl mb-3">More Coming soon...</h4>
            <p className="text-gray-400 text-lg line-clamp-3">
              We&apos;re working on a few more projects that we&apos;ll be
              releasing soon.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
