import {CSSProperties} from "react";
import {ColourElementState} from "./types";

export interface ColourElementsStyles {
    origin: CSSProperties,
    main: CSSProperties,
    text: CSSProperties,
}

export const getStyles = (state: ColourElementState, isBlendActive: boolean): ColourElementsStyles => {

    const origin = {
        width: state.width + state.borderWidth * 2,
        height: state.height + state.borderWidth * 2,
        left: state.position[0],
        top: state.position[1],
        zIndex: state.zIndex,
        mixBlendMode: isBlendActive ? state.blendMode : 'normal',
    } as CSSProperties;

    const main = {
        background: state.colour,
        width: state.width,
        height: state.height,
        left: 0,
        top: 0,
        transform: `rotate(${state.angle}grad)`,
        borderWidth: state.borderWidth,
        borderRadius: state.borderRadius,
        borderColor: state.borderColor,
        borderStyle: state.borderStyle,
        boxShadow: `${state.shadowInset ? 'inset ' : ''}${state.shadowXYOffset[0]}px ${state.shadowXYOffset[1]}px ${state.shadowBlur}px ${state.shadowSpread}px ${state.shadowColor}`
    } as CSSProperties;

    const text = {
        fontSize: state.fontSize,
        fontFamily: state.font,
        fontStyle: state.fontStyle,
        fontWeight: state.fontWeight,
        color: state.textColour,
        position: 'absolute',
        left: state.textPosition[0],
        top: state.textPosition[1],
        textShadow: `${state.textShadowXYOffset[0]}px ${state.textShadowXYOffset[1]}px ${state.textShadowBlur}px ${state.textShadowColor}`
    } as CSSProperties;

    return {origin, main, text}
}