# This is a website builder that builds you a photo portfolio based on your photos

## How to use

### 1. Install modules
   
   `npm install`

### 2. Build and run javascript to create folder structure

   Windows: `npm run start`

   Other: `tsc`, `node .`



### 3. Add your images 
Create a folder for each category/collection in the `data/Categories/` folder. Each folder will get it's own page, showing all images inside the folder.
   ```
   data/
     Categories/
       Japan/
         img1.jpg
         img2.jpg
       Macro/
         img1.jpg
         img2.jpg
         img3.jpg
   ...
   ```
   

### 4. Build website again
   
   `node .`

### 5. Check out the built website

   Open the generated website in `website_build/`

### 6. Adjust the website content

   Go into `data/` and adjust the content of the `data.json` files both in the root and in every category/collection folder that you created.

### 7. Build website again

   `node .`

### Repeat step 6. and 7. to adjust your website!
