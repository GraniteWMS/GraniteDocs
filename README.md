# GraniteDocs

## Getting started with this repo

Install latest python 3 from https://www.python.org/downloads/

Install mkdocs using `pip install mkdocs` from terminal.
Install the material theme using `pip install mkdocs-material`.
Install the versioning plugin mike using `pip install mike`.

On Windows you may need prefix python commands with `python -m` eg. `python -m pip install mkdocs` 

Once mkdocs is installed, using the terminal browse to the root folder of the repo (should be `C:\Work\SC\GraniteDocs`).

From here you can run `mike serve` to view your local version of the docs at [http://localhost:8000/](http://localhost:8000/). You can stop the server with `ctrl + c`.

All markdown docs go in the `/docs` folder.

When you save changes to the markdown files mkdocs will automatically refresh your build in the browser.

For each version of the documentation there is a branch of this repo. 
The main branch is always the latest version of the documentation.

When you are ready to publish a new build of a version of documentation, ensure your changes are checked in on the branch then run `mike deploy [version] -p` from the terminal. E.g. `mike deploy 5.0 -p`. Note you will need to have configured git in order to do this, see setup below

When it is time to link a different version to the `latest` alias, you will deploy using `mike deploy [version] latest -u -p`

For more info see the official docs

- [https://www.mkdocs.org/getting-started/](https://www.mkdocs.org/getting-started/)
- [https://squidfunk.github.io/mkdocs-material/](https://squidfunk.github.io/mkdocs-material/)
- [https://github.com/jimporter/mike](https://github.com/jimporter/mike)

## Setting up Git

To perform the final step `mike deploy` you need to have git running locally. 

Download and install git from [https://git-scm.com/download/win](https://git-scm.com/download/win)

In git bash add your username and email that is connected to your github account using
```
    git config --global user.name "Your Name"

    git config --global user.email "youremail@gmail.com"
```

You will be redirected to github login the first time you run. After that it should be good to go.
