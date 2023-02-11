export type BulletsSchema = Array<{
    image: string
    titleBullet: string
    link?: LinkProps
}>

export interface LinkProps {
    url: string
    attributeNofollow?: boolean
    attributeTitle?: string
    openNewTab?: boolean
    newTab?: boolean
}