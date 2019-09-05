# Contributing to Crystal Ball

Contributions are welcome 🎉 This guide is a resource for navigating the project
structure and conventions.

## Code of Conduct

Please read the repository [Code of Conduct][], we take it seriously and
contributors are required to adhere to the guidelines.

## Committing with Commitizen

This project uses [Commitizen][] to make writing consistent commit messages
easy. On commit a Husky pre-commit hook will start an interactive terminal
session to step through each part of the commit message with prompts.

_ℹ️ Crystal Ball projects use Semantic Release to auto-release on change to
master and the consistent commit format is what makes this possible._

## Writing code

This project uses ESLint and Prettier to make writing consistent code easy.
Formatting and linting can be run with npm commands:

```
# Format the project with Prettier
npm run format

# Lint the project with ESLint
npm run test:lint
```

<!-- Links -->

[commitizen]: https://commitizen.github.io/cz-cli/
[code of conduct]: ../CODE_OF_CONDUCT.md
