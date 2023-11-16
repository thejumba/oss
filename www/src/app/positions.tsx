import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const positions = [
  {
    title: "Frontend Engineer",
    description:
      "Excited to build beautiful, performant applications in Typescript? We would love to chat with you. You'll be responsible for building out great user experiences for our customers and internal users.",
  },
  {
    title: "Backend Engineer",
    description:
      "We've built Jumba to be entirely serverless using Node.JS and AWS Amplify. You need not have experience in both to be considered.",
  },
  {
    title: "Mobile Engineer",
    description:
      "We are looking for mobile engineers interested in building applications on React Native.",
  },
  {
    title: "QA Engineer",
    description:
      "We aim to ship high quality and well tested features every single time. Our QA team is integral to that. Please reach out particularly if you are experienced with automated testing",
  },
  {
    title: "Site Reliability Engineer",
    description:
      "Our goal is to have an uptime of 99.99% across all our systems. You'll be tasked with building the pipelines and processes to support that.",
  },
  {
    title: "Product Manager",
    description:
      "Reporting direcly to the CTO, you'll work on guiding product development from inception to launch.",
  },
];

export function OpenPositions() {
  return (
    <div id="positions" className="p-10 mx-auto max-w-6xl">
      <h3 className="text-4xl font-medium mb-5">Open positions</h3>
      <p className="text-xl max-w-3xl text-gray-500">
        Want to work on interesting problems with a fun team? Then look no
        further. Any open positions will be listed here.
      </p>
      <section className="my-14 grid grid-cols-1 gap-10">
        {positions.map((position) => (
          <Accordion key={position.title} type="single" collapsible>
            <AccordionItem
              className="border transition-all border-gray-900 rounded-xl py-1.5 px-6 hover:bg-gray-900 text-lg"
              value={position.title}
            >
              <AccordionTrigger className="hover:no-underline">
                {position.title}
              </AccordionTrigger>
              <AccordionContent className="text-base">
                {position.description}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </section>
      <p className="text-xl max-w-3xl text-gray-500">
        If you’re interested, send in your application to{" "}
        <a
          className="text-blue-500 underline"
          href="mailto:careers@thejumba.com"
        >
          careers@thejumba.com
        </a>
        . You can tell us a bit about yourself, if you like. Please also
        include: 1. The job title you&apos;d like to apply for 2. your GitHub
        username 3. Why you&apos;re excited about joining Jumba and 4. a
        sentence about your favorite movie , so we know you’re not a bot. :)
      </p>
    </div>
  );
}
