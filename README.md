# GraniteDocs

## Getting started with this repo

Install latest python 3 from https://www.python.org/downloads/

Install mkdocs using `pip install mkdocs` from terminal.
On Windows you may need prefix any python commands with `python -m` eg. `python -m pip install mkdocs` 

Once mkdocs is installed, using the terminal browse to the root folder of the repo (should be `C:\Work\SC\Documentation`).

From here you can run `mkdocs serve` to view your local version of the docs at [http://127.0.0.1:8000/](http://127.0.0.1:8000/). You can stop the server with `ctrl + c`.

All markdown docs go in the `/docs` folder.

When you save changes to the markdown files mkdocs will automatically refresh your build in the browser.

When you are ready to publish the new build, ensure your files are checked into GitHub's main branch then run `mkdocs gh-deploy` from the terminal

For more info see [https://www.mkdocs.org/getting-started/](https://www.mkdocs.org/getting-started/)