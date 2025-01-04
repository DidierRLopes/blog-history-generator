# Blog Stats SVG Generator

Automatically generates an SVG visualization of your blog post history.

## Quick Setup

1. Fork this repository
2. Give the repo the correct permissions
    1. Click on Settings.
    2. Then go into Actions and click General.
    3. Scroll down and in Workflow permissions set "Read and write permissions".
3. Run the workflow.
    1. Click on Actions.
    2. Click on "Generate Blog History" on the left side.
    3. On the right side click on "Run workflow".
    4. A blog feed URL will be required to run this (e.g. https://didierlopes.com/blog/feed.json or https://simonwillison.net/tags/datasette.atom).
    5. Click "Run workflow".
  
That's it.

The SVG will be available here: [./output/blog-history.svg](./output/blog-history.svg).

## More customization

If you want further customization, you need to:

1. Clone this repository.

2. Install dependencies.

```
npm install
```

3. Run script.

```
npm run generate
```
