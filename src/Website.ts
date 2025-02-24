import { ImageData, OverviewData, CategoryData } from "./iData"
import fs from "fs";

const OUTPUTFOLDER: string = "website_build";

export class Website {
    title: string = "";
    description: string = "";

    categories: Category[] = [];

    build(): void {
        const rootPath: string = `./${OUTPUTFOLDER}`

        // clear output folder and make new folder structure
        if (fs.existsSync(rootPath)) {
            fs.rmSync(rootPath, { recursive: true, force: true })
            console.log("[INFO] Removed old output folder");
        }
        fs.mkdirSync(rootPath);
        fs.mkdirSync(rootPath + "/Categories");

        console.log("[INFO] Created output folder structure");

        // read data files
        this.readAllDataFiles();

        let htmlOverview: string = this.getHtmlOverview();
        writeToFile(rootPath + "/index.html", htmlOverview);
        console.log("[INFO] Created overview page")

        writeToFile(rootPath + "/styles.css", styleCSS);
        console.log("[INFO] Created stylesheet");

        for (let category of this.categories) {
            fs.mkdirSync(rootPath + "/Categories/" + category.foldername);
            fs.mkdirSync(rootPath + "/Categories/" + category.foldername + "/images");

            let categoryHtml: string = category.getHtmlCategory();
            writeToFile(rootPath + "/Categories/" + category.foldername + "/index.html", categoryHtml);
            console.log("[INFO] Created page for category " + category.title);

            let src: string = "./data/Categories/" + category.foldername + "/images"
            let dest: string = rootPath + "/Categories/" + category.foldername + "/images"
            fs.cpSync(src, dest, { recursive: true });
            console.log("[INFO] Copied images to build folder");
        }

        console.log("[INFO] Finished building website!")

    }

    getHtmlOverview(): string {

        let categoriesCopy: Category[] = this.categories.slice(); // Use a copy and remove one by one in order of priority
        let categoryContainers: string = "";

        if (categoriesCopy.length == 0) {
            console.error("[ERROR] Website has no categories");
        }

        while (categoriesCopy.length != 0) {
            // Find category with highest priorty
            let highestIndex: number = 0;
            let highestPriority: number = 0;

            for (let i = 0; i < categoriesCopy.length; i++) {
                if (categoriesCopy[i].priority > highestPriority) {
                    highestIndex = i;
                    highestPriority = categoriesCopy[i].priority;
                }
            }

            // pick highest priority category
            let category: Category = categoriesCopy[highestIndex];

            categoryContainers += `
            <div class="category-container">
                <div class="category-overlay" onclick="window.location.href = './Categories/${category.foldername}/index.html';">
                    <p class="category-button">${category.title}</p>
                    <p class="date">${category.date}</p>
                </div>
                <img class="category-image" src="./Categories/${category.foldername}/images/${category.thumbnail}" alt="">
            </div>
            `

            // remove from categories list
            categoriesCopy.splice(highestIndex, 1);
        }

        let html: string = `
<!DOCTYPE html>
<html lang="en">
<head>
    <META NAME="robots" CONTENT="noindex,nofollow">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Overview</title>
    <link rel="stylesheet" href="./styles.css">
</head>
<body>
    <div class="gallery-container">
        <div class="gallery gallery-fixedwidth">
            <div class="image-container">
                <h1 class="page-title">${this.title}</h1>
                <p>${this.description}</p>
            </div>
            <div class="categories">

${categoryContainers}

            </div>
            <footer>Website made from scratch using HTML, CSS and JavaScript</footer>
        </div>
    </div>
</body>
</html>
`
        return html;
    }

    readAllDataFiles(): void {

        this.readOverviewDataFile();

        let categoriesFolder: string = `./data/Categories`;
        let categoryFolders = fs.readdirSync(categoriesFolder);

        for (let categoryFolder of categoryFolders) {
            this.readDataFile(`${categoriesFolder}/${categoryFolder}/data.json`, categoryFolder);
        }

        console.log("[INFO] Finished reading all data files");
    }

    readOverviewDataFile(): void {
        if (!fs.existsSync("./data/data.json")) { return };
        const dataStr: string = fs.readFileSync("./data/data.json", "utf-8");
        const dataObj = JSON.parse(dataStr);
        const data: OverviewData = dataObj as OverviewData;

        this.title = data.title;
        this.description = data.description;

    }

    readDataFile(filepath: string, foldername: string): void {
        const dataStr: string = fs.readFileSync(filepath, "utf-8");
        const dataObj = JSON.parse(dataStr);

        const data: CategoryData = dataObj as CategoryData;

        let category = new Category(foldername, data.title, data.date, data.description, data.priority, data.thumbnail, data.images);
        this.categories.push(category);

        console.log("[INFO] Read datafile", filepath);
    }

    makeMissingDataFiles(): void {
        let count: number = 0;
        if (!fs.existsSync("./data/")){
            fs.mkdirSync("./data/");
            count += 1;
        }

        if (!fs.existsSync("./data/Categories")){
            fs.mkdirSync("./data/Categories");
            count += 1;
        }
        

        if (!fs.existsSync("./data/data.json")) {
            this.makeOverviewDataFile();
            count += 1;
        }

        let categoryFolders = fs.readdirSync(`./data/Categories`);
        for (let categoryFolder of categoryFolders) {
            if (!fs.existsSync("./data/Categories/" + categoryFolder + "/data.json")) {
                this.makeDataFile(categoryFolder);
                count += 1;
            }
        }

        if (count > 0) {
            console.log(`[INFO] Created ${count} new folders/files`);
        }
    }

    makeOverviewDataFile(): void {
        let data: OverviewData = {
            title: "Website Title",
            description: "Website description here. To change the website text, explore the 'data.json' files in the 'data/' folder."
        }
        const jsonData = JSON.stringify(data, null, 4);
        writeToFile("data/data.json", jsonData);
        console.log("[INFO] Created overview data file");
    }

    makeDataFile(folderName: string): void {
        let data: CategoryData = {
            title: folderName,
            date: "",
            description: "",
            priority: 0, // this is for the ordering in the "categories" page. Highest -> First
            thumbnail: "",
            images: []
        }

        let imageFiles: string[] = fs.readdirSync("data/Categories/" + folderName + "/images");

        for (let imageFile of imageFiles) {
            if (data.thumbnail === "") {
                data.thumbnail = imageFile;
            }
            let image: ImageData = {
                filename: imageFile,
                title: "",
                description: ""
            }
            data.images.push(image);
        }

        const jsonData = JSON.stringify(data, null, 4);
        writeToFile("data/Categories/" + folderName + "/data.json", jsonData);
        console.log("[INFO] Created data file for folder " + folderName);
    }
}

class Category {
    foldername: string = "";
    title: string = "";
    date: string = "";
    description: string = "";
    priority: number = 0;
    thumbnail: string = "";
    images: ImageData[] = []

    constructor(foldername: string, title: string, date: string, description: string, priority: number, thumbnail: string, images: ImageData[]) {
        this.foldername = foldername;
        this.title = title;
        this.date = date;
        this.description = description;
        this.priority = priority;
        this.thumbnail = thumbnail;
        this.images = images;
    }

    getHtmlCategory(): string {

        let imageContainers: string = "";

        for (let image of this.images) {
            let imagePath: string = `./Categories/${this.foldername}/${image.filename}`;
            imageContainers += `\n
            <div class="image-container">
                <p class="title">${image.title}</p>
                <img class="gallery-image" src="./images/${image.filename}"></img>
                <p class="description">${image.description}</p>
            </div>`
        }

        let html: string = `
<!DOCTYPE html>
<html lang="en">
<head>
    <META NAME="robots" CONTENT="noindex,nofollow">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gallery</title>
    <link rel="stylesheet" href="../../styles.css">
</head>
<body>


    <div class="gallery-container">
        <div class="gallery">


            <div class="image-container first-container">
                <h1 class="page-title">${this.title}</h1>
                <p class="page-description">
                    ${this.description}
                </p>
            </div>

            ${imageContainers}

            <footer>Website made from scratch using HTML, CSS and JavaScript</footer>

        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
`

        return html;

    }
}

function writeToFile(path: string, data: string): void {
    fs.writeFileSync(path, data, 'utf8');
}


const styleCSS: string = `
@font-face {
    font-family: "Raleway";
    src: url("https://fonts.gstatic.com/s/raleway/v34/1Ptug8zYS_SKggPNyC0ITw.woff2") format("woff2");
    font-style: normal;
    font-weight: 200;
    font-display: swap;
    unicode-range: U+0-FF, U+131, U+152-153, U+2BB-2BC, U+2C6, U+2DA, U+2DC, U+304, U+308, U+329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
    font-family: "Raleway";
    src: url("https://fonts.gstatic.com/s/raleway/v34/1Ptug8zYS_SKggPNyC0ITw.woff2") format("woff2");
    font-style: normal;
    font-weight: 500;
    font-display: swap;
    unicode-range: U+0-FF, U+131, U+152-153, U+2BB-2BC, U+2C6, U+2DA, U+2DC, U+304, U+308, U+329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

body {
    margin: 0;
    background-color: #F2F2F2;
    color: #474747;
}

.gallery-container {
    display: grid;
    justify-content: center;
    margin: -1rem 1rem 0 1rem;
}

.gallery {
    width: 100%;
    background-color: white;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.05), 0 6px 20px 0 rgba(0, 0, 0, 0.04);
}

.gallery-fixedwidth {
    max-width: 1000pt;
}

.image-container {
    margin: 0;
    padding: 1rem 2rem 1rem 2rem;
    /* background-color: #fdfdfd;
    border-radius: 8px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.05), 0 6px 20px 0 rgba(0, 0, 0, 0.04); */
    justify-content: center;
    display: grid;
}

.first-container {
    display: block;
}

.page-title {
    padding: 0;
    font-size: 42pt;
    margin-bottom: 0;
}

.page-description {
    width: 0;
    min-width: 100%;
    margin: 0;
    margin-top: 1rem;
    font-size: 16pt;
    font-weight: 200;
    text-align: justify;
    letter-spacing: 1pt;
}

.title {
    letter-spacing: 1pt;
    font-size: 24pt;
    margin: 0;
    margin-bottom: 1rem;
    font-weight: 200;
    /* text-decoration: underline; */
}

.description {
    width: 0;
    min-width: 100%;
    margin: 0;
    margin-top: 1rem;
}

.gallery-image {
    display: block;
    max-width: 100%;
    max-height: 65vh;
    height: auto;
    width: auto;

    display: block;

    pointer-events: none;
}

p,
h1,
h2,
h3,
footer {
    font-family: 'Raleway', sans-serif;
    font-weight: 200;
}

p {
    font-size: 16pt;
    font-weight: 200;
    text-align: justify;
    letter-spacing: 1pt;
}

footer {
    text-align: center;
    margin-bottom: 2rem;
}





.categories {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 2rem;
}

.category-container {
    position: relative;
    width: fit-content;
    overflow: hidden;

    margin: 10pt;

}

.category-image {
    display: block;
    width: 300pt;
    height: 300pt;
    object-fit: cover;
}

.category-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    /* flex-direction: row; */
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.25s;
    cursor: pointer;
}

.category-overlay:hover {
    backdrop-filter: blur(20px);
    opacity: 1;
}

.date {
    position: absolute;
    bottom: 0;
    margin: 0;
    padding: 0.5em 2em;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    width: 100%;
    text-align: center;
}

.category-button {
    background-color: black;
    color: white;
    padding: 0.5em 2em;
    text-decoration: none;
    letter-spacing: .25em;
    border: 1px solid white;
    text-align: center;
}
`