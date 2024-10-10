"use client";
import miano from "@/assets/avatars/miano.jpeg";
import ndaba from "@/assets/avatars/ndaba.jpeg";
import njeri from "@/assets/avatars/njeri.jpeg";
import oyiolo from "@/assets/avatars/oyiolo.jpeg";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { SVGProps } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const team = [
  {
    name: "Miano Njoka",
    title: "C.T.O",
    image: miano,
    about:
      "Miano co-founded Jumba with Kagure in April 2022 and leads the software engineering and product management teams. Prior to founding Jumba, Miano worked at Google in San Francisco, California for 7 years on a variety of products including Google Ads, Google Assistant and Google Chrome. Before joining Google, Miano was a Software Engineer at the United Nations in Nairobi. Miano holds a BSc in Computer Science from JKUAT and an MBA from the University of Illinois at Urbana-Champaign.",
    socials: {
      linkedIn: "https://www.linkedin.com/in/miano/",
    },
  },
  {
    name: "Victor Ndaba",
    title: "Team Lead",
    image: ndaba,
    about:
      "A skilled software developer with a deep passion for elegant and quality code, Victor believes that well-crafted solutions can be artistic. As Tech Lead, he excels in full-stack development and oversees some cool projects.  A strong advocate for open source, Victor champions collaborative development and actively contributes to the community. His career path transitioned from mechatronics engineering to software development, highlighting his self-taught skills and adaptable nature. When not immersed in code, you might find him debating film trivia or tinkering with the laws of physics.",
    socials: {
      linkedIn: "https://linkedin.com/in/victor-ndaba",
    },
  },
  {
    name: "Michelle Njeri",
    title: "Frontend Engineer",
    image: njeri,
    about:
      "Michelle's journey from veterinary medicine to software development is anything but typical, but that's what makes her story so compelling. Currently pursuing a BSc in IT at JKUAT, she began her coding adventure while studying Veterinary Medicine at the University of Nairobi, proving that curiosity knows no bounds. Before joining Jumba, Michelle applied her skills to build .NET platforms for insurance agencies. Now, as a Moringa School graduate, she's fully immersed in the world of frontend development, where her creativity shines. Driven by a passion for crafting seamless and engaging user experiences, Michelle is set to leave her mark in the tech industry.",
    socials: {
      linkedIn: "https://linkedin.com/in/michelle-njeri",
    },
  },
  {
    name: "Michelle Oyiolo",
    title: "Mobile Engineer",
    image: oyiolo,
    about:
      "Michelle Oyiolo is a highly skilled software engineer within Jumba's mobile development team since January 2023. With a robust background in full-stack development, she is deeply committed to collaborative coding. Michelle has also successfully deployed two mobile applications. Graduating top of her class with a degree in Applied Computer Technology from the United States International University, Africa, she previously earned a diploma in Mobile Application Development from Riara University. ßMichelle is always eager for new challenges, striving to advance her role in the ever-changing software development field.",
    socials: {
      linkedIn: "https://linkedin.com/in/michelle-oyiolo",
    },
  },
];

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 620 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 620, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
};

function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      className={cn("w-4 h-4", props.className)}
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
  );
}

function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      className={cn("w-4 h-4", props.className)}
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
  );
}

function TwitterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      className={cn("w-4 h-4", props.className)}
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
  );
}

export function JumbaTeam({ deviceType }: { deviceType: string }) {
  return (
    <div className="mx-auto max-w-6xl py-16 px-10 border-t border-gray-900/70">
      <h2 className="text-center text-3xl md:text-4xl mb-6">Meet the team</h2>
      <p className="px-0 md:px-4 max-w-3xl mx-auto text-xl text-gray-500 text-center">
        We&apos;re a small, fun team working on interesting solutions and we
        love to apply our skills to solve practical problems in the construction
        industry.
      </p>
      <Carousel
        swipeable={true}
        draggable={true}
        centerMode={false}
        showDots={true}
        dotListClass="custom-dot-list-style"
        focusOnSelect={true}
        responsive={responsive}
        ssr={true}
        infinite={true}
        keyBoardControl={true}
        transitionDuration={700}
        containerClass="carousel-container"
        removeArrowOnDeviceType={[]}
        deviceType={deviceType}
        itemClass="carousel-item-padding-40-px"
        className="mt-12 mb-5"
      >
        {team.map((member) => (
          <div className="pt-4 pb-12 px-2" key={member.name}>
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-2/5 px-4" style={{}}>
                <div className="flex flex-col" style={{}}>
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
                    className="rounded-full"
                  />
                </div>
              </div>
              <div className="w-full md:w-3/5 px-0 md:px-4" style={{}}>
                <div className="flex flex-col">
                  <div className="border-b py-4 space-y-1 border-gray-900/70">
                    <h2 className="text-3xl text-gray-200">{member.name}</h2>
                    <p className="pl-1 text-gray-400">{member.title}</p>
                  </div>

                  <p className="text-gray-400 text-lg pt-3">{member.about}</p>

                  {member.socials && Object.keys(member.socials).length > 0 && (
                    <ul
                      className="flex justify-center space-x-8 pt-5"
                      style={{}}
                    >
                      {Object.entries(member.socials).map(
                        ([platform, link]) => (
                          <li key={member.name + "-" + platform}>
                            <Link
                              target="_blank"
                              href={link}
                              className={cn(
                                buttonVariants({ variant: "outline" }),
                                "flex !items-center space-x-2"
                              )}
                            >
                              {platform == "linkedIn" && (
                                <>
                                  <LinkedInIcon className="w-3 h-3 p-0 m-0 text-blue-500" />
                                  <span className="p-0 mt-0.5">LinkedIn</span>
                                </>
                              )}
                              {platform == "github" && <GithubIcon />}
                              {platform == "twitter" && <TwitterIcon />}
                            </Link>
                          </li>
                        )
                      )}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

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
  );
}
