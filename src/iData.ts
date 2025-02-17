export interface ImageData {
    filename: string,
    title: string,
    description: string
}

export interface OverviewData {
    title: string,
    description: string
}

export interface CategoryData {
    title: string,
    date: string,
    description: string,
    priority: number,
    thumbnail: string,
    images: ImageData[]
}
