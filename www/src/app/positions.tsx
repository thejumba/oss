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
      "We are looking for a Frontend Engineer to join our team. You will be responsible for building the 'client-side' of our web applications. You should be able to translate our company and customer needs into functional and appealing interactive applications.",
  },
  {
    title: "Backend Engineer",
    description:
      "We are looking for a Backend Engineer to join our team. You will be responsible for building the 'server-side' of our web applications. You should be able to translate our company and customer needs into functional and appealing interactive applications.",
  },
  {
    title: "Mobile Engineer",
    description:
      "We are looking for a Mobile Engineer to join our team. You will be responsible for building the 'client-side' of our mobile applications. You should be able to translate our company and customer needs into functional and appealing interactive applications.",
  },
  {
    title: "QA Engineer",
    description:
      "We are looking for a QA Engineer to join our team. You will be responsible for testing our web and mobile applications. You should be able to translate our company and customer needs into functional and appealing interactive applications.",
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
        sentence about your favorite movie , so we know you’re not a bot :)
      </p>
    </div>
  );
}
