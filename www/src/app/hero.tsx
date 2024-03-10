import jumba from "@/assets/jumba.png";
import { Badge } from "@/components/ui/badge";
import { IconBrandGithub } from "@tabler/icons-react";
import {
  ArrowUpRightIcon
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { GridPattern } from "./grid-pattern";

export function Hero() {
  return (
    <section className="relative">
      <header className="p-5 mx-auto max-w-[85rem] gap-5 flex items-center bg-transparent">
        <Image src={jumba} alt="Jumba Name" height={25} className="z-10" />
        <h1 className="text-xl -ml-2 hidden sm:flex z-10 font-medium">
          {" "}
          {"< "} Developers {" />"}
        </h1>
        <nav className="ml-auto hidden md:flex items-center gap-8 z-10">
          <Link href="#positions" className="relative">
            Careers
            <Badge className="absolute top-0 bg-orange-400/20 text-orange-400/80 -left-10 rounded-full">4</Badge>
          </Link>

          <Link href="https://jumba.com">
            Jumba
            <ArrowUpRightIcon className="inline-block ml-1" />
          </Link>
          <Link href="https://github.com/thejumba">
            Github
            <IconBrandGithub className="inline-block ml-1" />
          </Link>
        </nav>
      </header>
      <div className="absolute bottom-0 right-0 z-[1] h-14 w-full bg-gradient-to-t from-background to-transparent"></div>
      <div className="text-gray-900">
        <GridPattern x="80%" patternTransform="translate(0 80)" />
      </div>
      <div className="mx-auto max-w-2xl py-32 sm:py-48 relative px-6 md:px-0">
        {/* <div className="absolute bottom-0 right-0 top-0 left-0 z-[1] h-full w-full bg-gradient-radial from-background from-0% to-80% to-transparent"></div> */}
        {/* <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-300 ring-1 ring-gray-100/10 hover:ring-gray-100/20">
            Announcing our next round of funding.{" "}
            <a href="#" className="font-semibold text-orange-600">
              <span className="absolute inset-0" aria-hidden="true" />
              Read more <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div> */}

        <div className="text-center relative z-10">
          <h1 className="text-4xl font-bold tracking-tight text-gray-100 sm:text-6xl">
            Construction in Africa, Simplified
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-400">
            Our vision is to be the go-to partner for construction projects in Africa. 
            We, the tech team at Jumba, are excited to share what we have been working
            on. Scroll down to see our open source projects and open roles on the team.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-8">
            <Link
              href="https://jumba.com"
              className="rounded-md bg-orange-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Visit Jumba
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
