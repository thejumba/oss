import { JumbaBenefits } from "./benefits";
import { Hero } from "./hero";
import { JumbaOpenSource } from "./oss";
import { OpenPositions } from "./positions";
import { JumbaTeam } from "./team";
import { TextReveal } from "./text-reveal";

export default function Home() {
  const textToReveal =
    "Our mission is to advance the construction industry by leveraging technology to simplify processes, enhance transparency, and increase reliability and efficiency in order to make construction materials more accessible to people across Africa.";

  return (
    <main className="relative">
      <Hero />
      <TextReveal block={textToReveal} />
      <JumbaOpenSource />
      <JumbaTeam />
      <JumbaBenefits />
      <OpenPositions />

      {/* Footer */}
      <div className="mt-40 mb-10 border-t border-gray-900/70 mx-auto max-w-7xl flex flex-col md:flex-row gap-5 md:gap-0 items-center justify-center md:justify-between p-3 pt-10">
        <h4>Made with ❤️ by Jumba</h4>
        <h4>
          &copy; {new Date().getFullYear()} Jumba Technologies Kenya Limited.
          All rights reserved.
        </h4>
      </div>
    </main>
  );
}
