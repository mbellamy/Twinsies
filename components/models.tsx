

/**
 *
 * Stores has of image and date used.
 * @export
 * @interface TImage
 * @extends {TCore}
 */
export interface TImage  {
    hash: string
    faceId: string
    date: number
}


/**
 *
 * Holds 2 images that were compared and their score.
 * @export
 * @interface TCompare
 * @extends {TCore}
 */
export interface TCompare {
    image1: TImage
    image2: TImage
    score: number

}

