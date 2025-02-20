# This is a website builder that builds you a photo portfolio based on your photos

## Table of contents

- How to use
   1. Install Modules
   2. Build and run javascript to create folder structure
   3. Add your images
   4. Build website again
   5. Check out the built website
   6. Adjust the website content
   7. Build website again
   <br>Repeat step 6. and 7. to adjust your website!

- Important
   - Renaming image files


## How to use

### 1. Install modules
   
   `npm install`

### 2. Build and run javascript to create folder structure

   Windows: `npm run start`

   Other: `tsc`, `node .`



### 3. Add your images 
Create a folder for each category/collection in the `data/Categories/` folder. Inside, create a `images/` folder, where you add your images. Each folder will get it's own page, showing all images inside the folder.
   ```
   data/
     Categories/
       Japan/
         images/
           img1.jpg
           img2.jpg
       Macro/
         images/
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

<br></br>
## Important

### Renaming image files
If you rename image files, you will also have to change the names in their respective `data.json` files. Alternatively, you can delete the affected `data.json` file and it will be regenerated when you build the website the next time. Keep in mind that this will remove all the titles and descriptions you have added for all images in the category.
