import { cn } from "@/lib/utils";
import { HomeModernIcon } from "@heroicons/react/20/solid";
import {
    DollarSignIcon,
    DumbbellIcon,
    HeartPulseIcon,
    Laptop2Icon,
    PercentCircle,
} from "lucide-react";

const benefits = [
  {
    title: "Competitive salary",
    description:
      "The problems we're trying to solve will require all your brainpower, therefore financial issues shouldn't be a thing",
    color: "green",
    accent: "bg-green-400/5",
    background: "bg-green-400/20",
    text: "text-green-400/40",
    icon: DollarSignIcon,
  },
  {
    title: "Stock Options",
    description:
      "Eligible full-time employees get to participate in our employee stock option plan",
    color: "yellow",
    accent: "bg-yellow-400/5",
    background: "bg-yellow-400/20",
    text: "text-yellow-400/40",
    icon: PercentCircle,
  },
  {
    title: "Health Insurance",
    description:
      "All full-time employees are eligible for health insurance coverage for themselves and their spouse and up to 4 children",
    color: "red",
    accent: "bg-red-400/5",
    background: "bg-red-400/20",
    text: "text-red-400/40",
    icon: HeartPulseIcon,
  },
  {
    title: "Gym Membership",
    description:
      "Employee health is really important to us. We'll reimburse the membership cost to your favorite gym.",
    color: "blue",
    accent: "bg-blue-400/5",
    background: "bg-blue-400/20",
    text: "text-blue-400/40",
    icon: DumbbellIcon,
  },
  {
    title: "Work From Home Flexibility",
    description:
      "We' a cool team :) Work from home or the office depending on what works best for you and the team.",
    color: "purple",
    accent: "bg-purple-400/5",
    background: "bg-purple-400/20",
    text: "text-purple-400/40",
    icon: HomeModernIcon,
  },
  {
    title: "First-class hardware",
    description:
      "We'll provide you with bleeding edge hardware and tools that you'll need to help you do your best work.",
    color: "pink",
    accent: "bg-pink-400/5",
    background: "bg-pink-400/20",
    text: "text-pink-400/40",
    icon: Laptop2Icon,
  },
];

export function JumbaBenefits() {
  return (
    <div className="py-16 px-10 border-t border-gray-900/70 max-w-6xl mx-auto">
      <h2 className="text-center text-3xl md:text-4xl mb-6">
        Perks & Benefits
      </h2>
      <p className="text-xl mx-auto text-gray-500 text-center max-w-2xl">
        We offer a range of benefits to our team members
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 my-16">
        {/* <div className="rounded-xl bg-green-400/5 flex gap-5 p-8">
            <div className="w-10 h-10 rounded-full bg-green-400/20 flex-shrink-0 flex items-center justify-center">
              <DollarSignIcon className="w-6 h-6 text-green-400/40" />
            </div>
            <div>
              <h4 className="text-xl mb-3">Competitive salary</h4>
              <p className="text-gray-400 text-lg">
                The problems we&apos;re trying to solve will require all your
                brainpower, therefore financial issues shouldn&apos;t be a thing
              </p>
            </div>
          </div> */}
        {benefits.map((benefit) => (
          <div
            key={benefit.title}
            className={cn(`rounded-xl flex gap-5 p-8 py-10`, benefit.accent)}
          >
            <div
              className={cn(
                `w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center`,
                benefit.background
              )}
            >
              <benefit.icon className={cn(`w-6 h-6`, benefit.text)} />
            </div>
            <div>
              <h4 className="text-xl mb-3">{benefit.title}</h4>
              <p className="text-gray-400 text-lg">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
