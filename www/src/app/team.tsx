"use client"
import blank from "@/assets/avatars/blank.jpeg"
import brian from "@/assets/avatars/brian.jpeg"
import gitau from "@/assets/avatars/gitau.jpeg"
import gloria from "@/assets/avatars/gloria.jpeg"
import katungi from "@/assets/avatars/katungi.jpeg"
import ken from "@/assets/avatars/ken.jpeg"
import miano from "@/assets/avatars/miano.jpeg"
import ndaba from "@/assets/avatars/ndaba.jpeg"
import njeri from "@/assets/avatars/njeri.jpeg"
import noella from "@/assets/avatars/noella.jpeg"
import oyiolo from "@/assets/avatars/oyiolo.jpeg"
import oyoo from "@/assets/avatars/oyoo.jpeg"
import rajab from "@/assets/avatars/rajab.jpeg"
import tonny from "@/assets/avatars/tonny.jpeg"
import wanjala from "@/assets/avatars/wanjala.jpeg"
import Image from "next/image"
import Link from "next/link"
import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"

const team = [
  {
    name: "Miano Njoka",
    title: "CTO",
    image: miano,
    about:
      "Introducing Miano, our CTO extraordinaire—a tech visionary navigating the digital seas. With a strategic compass and laptop, he ensures our company sails toward innovation with resilience and foresight.",
    socials: {
      linkedIn: "https://linkedin.com/in/miano",
      github: "https://github.com/miano",
      twitter: "https://twitter.com",
    },
  },
  {
    name: "Victor Ndaba",
    title: "Team Lead",
    image: ndaba,
    about:
      "Meet Victor, our Senior Programmer—code virtuoso orchestrating symphonies of logic. With a keyboard as his instrument, he blends innovation and efficiency seamlessly into every line of code.",
    socials: {},
  },
  {
    name: "Gitau Mburu",
    title: "Project Manager",
    image: gitau,
    about:
      "Gitau, our Project Manager extraordinaire—a strategic juggernaut conducting the project orchestra with precision. Armed with a Gantt chart baton and collaboration toolkit, visions transform into milestones for harmonious success.",
    socials: {},
  },
  {
    name: "Michelle Njeri",
    title: "Frontend Engineer",
    image: njeri,
    about:
      "Meet Michelle, our Front-End Engineer—the artist crafting digital experiences with code and creativity. She transforms design concepts into visually stunning and user-friendly interfaces, making every click a visual delight.",
    socials: {},
  },
  {
    name: "Philip Oyoo",
    title: "Backend Engineer",
    image: oyoo,
    about:
      "Introducing Oyoo, our Backend Engineer—the architect of digital foundations and data maestro. With databases and server-side languages, he constructs the backbone of our applications, ensuring efficiency and reliability.",
    socials: {},
  },
  {
    name: "Michelle Oyiolo",
    title: "Mobile Engineer",
    image: oyiolo,
    about:
      "Meet Oyiolo, our Mobile Engineer—the app virtuoso transforming concepts into touchable reality. With a passion for user-centric design, she crafts seamless experiences, delighting users with every tap and swipe.",
    socials: {},
  },
  {
    name: "Brian Mulaa",
    title: "Frontend Engineer",
    image: brian,
    about:
      "Meet Brian, our Frontend Virtuoso—the maestro choreographing visually stunning ballets of user interfaces. His code dances gracefully between browsers, ensuring a symphony of seamless experiences.",
    socials: {},
  },
  {
    name: "Tonny Bett",
    title: "Backend Engineer",
    image: tonny,
    about:
      "Introducing Tonny, our SAP-Whisperer and Backend Maestro. Armed with server-side languages and SAP expertise, he orchestrates the backend symphony that powers our enterprise solutions.",
    socials: {},
  },
  {
    name: "Noella Mwanzia",
    title: "Backend Engineer",
    image: noella,
    about:
      "Meet Noela, our Full-Stack Alchemist and Backend Sorceress. With a toolkit spanning server-side languages, she crafts digital realms seamlessly bridging front and back ends.",
    socials: {},
  },
  {
    name: "Rajab Karume",
    title: "Frontend Engineer",
    image: rajab,
    about:
      "Introducing Rajab, our Frontend Artisan—the code sculptor turning design visions into digital masterpieces. His code blends aesthetics and functionality, creating dynamic and captivating online experiences.",
    socials: {},
  },
  {
    name: "Willies Wanjala",
    title: "Mobile Engineer",
    image: wanjala,
    about:
      "Meet Willies, our Mobile Maestro and Expo Virtuoso. Navigating the mobile landscape with precision, he crafts seamless app experiences with Expo and React Native, making app development a captivating journey.",
    socials: {},
  },
  {
    name: "Daniel Denis",
    title: "Mobile Engineer",
    image: katungi,
    about:
      "Enter the world of mobile magic with Danniel, our Mobile Engineer Extraordinaire. Armed with Swift and Kotlin spells, he conjures up seamless and responsive app experiences.",
    socials: {},
  },
  {
    name: "Gloria Osoro",
    title: "UI/UX Designer",
    image: gloria,
    about:
      "Meet Maya, our UI/UX Maestro and Figma Virtuoso. Shaping digital experiences with an artistic touch, she weaves interactive tales of user delight, enhancing user journeys with visually stunning and intuitive designs.",
    socials: {},
  },
  {
    name: "John Kimani",
    title: "QA Engineer",
    image: blank,
    about:
      "Meet our QA Maestro, John meticulous navigator of digital landscapes. John ensures the seamless orchestration of software harmony. He transforms potential glitches into polished perfection",
    socials: {},
  },
  {
    name: "Ken Kimanzi",
    title: "Developer",
    image: ken,
    about:
      "Introducing Ken, our emerging code maestro! Beware of his coding prowess; destined for greatness, it paves the way for innovation in every line of code he composes.",
    socials: {
      github: "https://github.com/kkimanzi",
    },
  },
]

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 1, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 620 },
    items: 2,
    slidesToSlide: 1, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 620, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
}

export function JumbaTeam({ deviceType }: { deviceType: string }) {
  return (
    <div className="py-16 px-10 border-t border-gray-900/70 max-w-7xl mx-auto">
      <h2 className="text-center text-3xl md:text-4xl mb-6">Meet the team</h2>
      <p className="text-xl mx-auto text-gray-500 text-center max-w-2xl mb-5">
        We&apos;re a small, fun team working on interesting solutions and we
        love to apply our skills to solve practical problems in the construction
        industry.
      </p>
      <Carousel
        swipeable={true}
        draggable={false}
        centerMode={deviceType == "mobile" ? false : true}
        showDots={true}
        dotListClass="custom-dot-list-style"
        focusOnSelect={true}
        responsive={responsive}
        ssr={true}
        infinite={true}
        keyBoardControl={true}
        transitionDuration={700}
        containerClass="carousel-container"
        removeArrowOnDeviceType={["mobile"]}
        deviceType={deviceType}
        itemClass="carousel-item-padding-40-px"
        className="mb-5"
      >
        {team.map((member) => (
          <div className="pt-4 pb-12 px-2" key={member.name}>
            <Image
              src={member.image}
              alt={member.name}
              sizes="100vw"
              // Make the image display full width
              style={{
                width: "100%",
                height: "auto",
                objectFit: "fill",
              }}
              className="rounded-xl"
            />
            <div className="flex flex-col">
              <h3 className="text-xl font-semibold mt-4 text-center">
                {member.name}
              </h3>
              <p className="text-center py-1">{member.title}</p>
              <p className="text-gray-500 mb-5">{member.about}</p>
              {member.socials && Object.keys(member.socials).length > 0 && (
                <ul
                  className="flex justify-center space-x-3"
                  style={{
                    position: "absolute",
                    bottom: "36px",
                    left: "0px",
                    right: "0px",
                  }}
                >
                  {Object.entries(member.socials).map(([platform, link]) => (
                    <li key={member.name + "-" + platform}>
                      <a
                        href={link}
                        className="text-gray-500 hover:text-gray-900 dark:hover:text-white dark:text-gray-400"
                      >
                        {platform == "linkedIn" && (
                          <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        )}
                        {platform == "github" && (
                          <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        )}
                        {platform == "twitter" && (
                          <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </Carousel>
      <div className="flex flex-col items-center py-6">
        <hr
          className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"
          style={{ width: "70%" }}
        />
      </div>

      <div className="flex flex-col items-center pt-8">
        <h3 className="text-center text-2xl md:text-3xl mb-6">
          Interested in working with us?
        </h3>
        <Link
          href="#positions"
          className="text-gray-500 text-center hover:underline"
        >
          See open positions
        </Link>
      </div>
    </div>
  )
}
