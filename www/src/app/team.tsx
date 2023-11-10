import Image from "next/image";
import Link from "next/link";

import brian from "@/assets/avatars/brian.jpeg";
import gitau from "@/assets/avatars/gitau.jpeg";
import gloria from "@/assets/avatars/gloria.jpeg";
import katungi from "@/assets/avatars/katungi.jpeg";
import miano from "@/assets/avatars/miano.jpeg";
import ndaba from "@/assets/avatars/ndaba.jpeg";
import njeri from "@/assets/avatars/njeri.jpeg";
import noella from "@/assets/avatars/noella.jpeg";
import oyiolo from "@/assets/avatars/oyiolo.jpeg";
import oyoo from "@/assets/avatars/oyoo.jpeg";
import rajab from "@/assets/avatars/rajab.jpeg";
import tonny from "@/assets/avatars/tonny.jpeg";
import wanjala from "@/assets/avatars/wanjala.jpeg";

const team = [
  {
    name: "Miano Njoka",
    title: "CTO",
    image: miano,
  },
  {
    name: "Victor Ndaba",
    title: "Team Lead",
    image: ndaba,
  },
  {
    name: "Gitau Mburu",
    title: "Project Manager",
    image: gitau,
  },
  {
    name: "Michelle Njeri",
    title: "Frontend Engineer",
    image: njeri,
  },
  {
    name: "Philip Oyoo",
    title: "Backend Engineer",
    image: oyoo,
  },
  {
    name: "Michelle Oyiolo",
    title: "Mobile Engineer",
    image: oyiolo,
  },
  {
    name: "Brian Mulaa",
    title: "Frontend Engineer",
    image: brian,
  },
  {
    name: "Tonny Bett",
    title: "Backend Engineer",
    image: tonny,
  },
  {
    name: "Noella Mwanzia",
    title: "Backend Engineer",
    image: noella,
  },
  {
    name: "Rajab Karume",
    title: "Frontend Engineer",
    image: rajab,
  },
  {
    name: "Willies Wanjala",
    title: "Mobile Engineer",
    image: wanjala,
  },
  {
    name: "Daniel Denis",
    title: "Mobile Engineer",
    image: katungi,
  },
  {
    name: "Gloria Osoro",
    title: "UI/UX Designer",
    image: gloria,
  },
  {
    name: "John Kimani",
    title: "QA Engineer",
    image: "https://avatars.githubusercontent.com/u/1748393?v=4",
    twitter: "https://twitter.com/mianonjoka",
    github: "miano",
    linkedin: "https://www.linkedin.com/in/mianonjoka/",
  },
];

export function JumbaTeam() {
  return (
    <div className="py-16 px-10 border-t border-gray-900/70 max-w-7xl mx-auto">
      <h2 className="text-center text-3xl md:text-4xl mb-6">Meet the team</h2>
      <p className="text-xl mx-auto text-gray-500 text-center max-w-2xl">
        We&apos;re a small, fun team working on interesting solutions and we
        love to apply our skills to solve practical problems in the construction
        industry.
      </p>
      <div className="grid grid-cols-1 my-24 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-16">
        {team.map((member) => (
          <div className="flex flex-col items-center" key={member.name}>
            <Image
              src={member.image}
              alt={member.name}
              width={120}
              height={120}
              className="rounded-xl"
            />
            <h3 className="text-xl font-semibold mt-4">{member.name}</h3>
            <p className="text-gray-500 text-center">{member.title}</p>
          </div>
        ))}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-xl bg-gradient-to-tr from-yellow-400 to-orange-500 via-pink-500" />
          <h3 className="text-xl font-semibold mt-4">Could be you !</h3>
          <Link
            href="#positions"
            className="text-gray-500 text-center hover:underline"
          >
            See open positions
          </Link>
        </div>
      </div>
    </div>
  );
}
