This repository contains the codebase of [https://riccardoscalco.it/](https://riccardoscalco.it/).

# Some note on development choices.

I am not using any static site generator. Depending on your personal opinions, this choice may appear very brave or very crazy. I am aware of tools like Jekyll or Gatsby, nevertheless, I decided to avoid any building tool and to code everything by hand.

Of course, I need to partially repeat my code with the footer and header elements, as well as with the head element, but there are also some benefits:

* **Easier maintenance.** I am pretty sure that having zero dependencies provides easier maintenance in the long term. I have a strong motivation in spending time on the content and the style &mdash; I do not want to spend any time in tooling, whatever they promise. Copying around small code snippets is a price that I am willing to pay.

* **Future proof.** I strongly rely on web standards and I think that *semantic HTML* and CSS are future proof. I want a codebase that remains usable for the next twenty years or more. Semantic HTML let me focus on the content and provides a markup that can be styled *without* CSS classes. Semantic HTML and the absence of CSS classes assure easier maintenance too.

* **Constrains.** Turning down building tools was a hard choice. I am forced to face problems with simple solutions or with no solutions at all. In my experience, there is no better way to empower creativity than imposing clear constrains. Let see if it works.

## Development tools

I make use of tools to enforce conventions and improve code correctness, I use:

* the CSS and HTML [Nu validator](https://validator.github.io/validator/)
* [stylelint](https://stylelint.io/), a modern linter and fixer for CSS

Have a look at the `package.json` for the details.

