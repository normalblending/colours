export interface ColourElementState {
    position: [number, number]
    colour: string
    width: number
    height: number
    angle: number
    borderWidth: number
    borderRadius: number
    borderStyle: string
    borderColor: string
    zIndex: number
    blendMode?: string
    text: string
    textPosition: [number, number]
    fontSize: number
    font: string
    fontStyle: string
    fontWeight: string
    textColour: string
    shadowXYOffset: [number, number]
    shadowSpread: number
    shadowBlur: number
    shadowColor: string
    shadowInset: boolean
    textShadowXYOffset: [number, number]
    textShadowBlur: number
    textShadowColor: string

}

export enum ParameterTypes {
    TextInput = 'TextInput',
    NumberInput = 'NumberInput',
    XYDrag = 'XYDrag',
    XYDragPointerLock = 'XYDragPointerLock',
    XDrag = 'XDrag',
    YDrag = 'yDrag',
    XDragPointerLock = 'XDragPointerLock',
    YDragPointerLock = 'YDragPointerLock',
    SelectArray = 'SelectArray',
    Checkbox = 'Checkbox',
}

export interface ParameterConfig {
    name: string
    type: ParameterTypes
    props?: any
    visibility?: (state: ColourElementState) => boolean
    propsByState?: (state: ColourElementState) => any
}