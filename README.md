# Jumba OSS

Hello there 👋. Welcome to the Jumba Open Source repository. We are small, dynamic team that likes to move fast and ship things. In our projects, we use a lot of open source tools and in that spirit, we like to give back to the open source communities, by open sourcing some packages that we use and have found extremely useful. 

**Learn more about Jumba and what we do [here](https://jum.ba/oss)**

**Looking for a job? Check out our [open positions](https://jum.ba/jobs)**

## Getting Started
This repository is structured as a monorepo using [turbo](https://turbo.build) and [pnpm](https://pnpm.io). It contains the following structure:

- `www/` - The site hosted at `developers.jumba.com`
- `tooling/` - Shared configs for eslint and typescript
- `packages/` - Houses all individual open source packages


## Packages
- [@jumba/access-analyzer](./packages/access-analyzer/) - A tool to help you automate testing the permissions of your amplify powered applications
- [@jumba/amplify-nextjs](./packages/amplify-nextjs/) - A package to help you integrate amplify with nextjs
- [@jumba/lambda-utils](./packages/lambda-utils/) - A collection of utilities to help simplify your amplify lambda functions.

You will find that most of our packages are built around amplify, as we are heavy users of the amplify framework and it can be quite a pain to get things working just right. We hope that our packages can help you get up and running faster.

## Amplify Github Action
One other useful open source project not hosted in this repository is the [amplify github action](https://github.com/thejumba/amplify-action). This action allows you to easily deploy your amplify applications to the cloud using github actions.

Feel free to use the packages and let us know if you have any issues or suggestions. We are always looking to improve our packages and make them more useful to the community.

If you would like to contribute to any of the packages, please feel free to open a PR. The packages are licensed under the MIT license, so you are free to use them in any way you see fit.