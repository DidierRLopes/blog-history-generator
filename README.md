# Blog Stats SVG Generator

Automatically generates an SVG visualization of your blog post history.

### JSON Example

https://didierlopes.com/blog/feed.json

<img width="983" alt="Screenshot 2025-01-05 at 11 45 43 AM" src="https://github.com/user-attachments/assets/c0f60c72-02dc-405d-bcee-5389725e6aaa" />

### ATOM XML Example

https://simonwillison.net/tags/datasette.atom

<img width="962" alt="Screenshot 2025-01-05 at 11 45 59 AM" src="https://github.com/user-attachments/assets/550b46b9-198b-41a4-a274-f9693e50dbfb" />

## Quick Setup

1. Fork this repository
2. Give the repo the correct permissions
    1. Click on Settings.
    2. Then go into Actions and click General.
    3. Scroll down and in Workflow permissions set "Read and write permissions".

<img width="1436" alt="Screenshot 2025-01-05 at 12 02 19 PM" src="https://github.com/user-attachments/assets/3f060dca-73cd-435b-bcf2-6697e5500743" />

3. Run the workflow.
    1. Click on Actions.
    2. Click on "Generate Blog History" on the left side.
    3. On the right side click on "Run workflow".
    4. A blog feed URL will be required to run this (e.g. https://didierlopes.com/blog/feed.json or https://simonwillison.net/tags/datasette.atom).
    5. Click "Run workflow".
  
<img width="1429" alt="Screenshot 2025-01-05 at 12 06 58 PM" src="https://github.com/user-attachments/assets/7f738a7c-5aeb-4d8f-a6ee-c3561a214bda" />
  
That's it.

The SVG will be available here: [./output/blog-history.svg](./output/blog-history.svg).

<img width="1425" alt="Screenshot 2025-01-05 at 12 07 22 PM" src="https://github.com/user-attachments/assets/ba4aebe3-36a4-461e-a409-13e12bb1aee9" />

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
