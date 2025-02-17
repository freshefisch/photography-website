## This is a website builder that builds you a photo portfolio based on your photos

### How to use:

1. Install modules
   
   `npm install`

2. Add your images in the `data/` folder. Create a folder for each category/collection. Each folder will get it's own page.
   ```
   data/
   - Japan/
   - - img1.jpg
   - - img2.jpg
   ... etc
   ```
   

4. Build and run javascript:
   
   `npm run start`

5. Check out the built page

   Open the generated website in `website_build/`

6. Adjust the website content

   Go into `data/` and adjust the content of the `data.json` files both in the root and in every category/collection folder that you created.

7. Build website again

   `node .`

Repeat step 6. and 7. to adjust your website!
