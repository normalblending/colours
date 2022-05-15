import * as React from "react";
import {forwardRef, useMemo, useRef, useState, MouseEvent, useEffect, CSSProperties} from "react";
import styles from './ColourElement.css';
import {
    BlurEnterNumberInput,
    BlurEnterTextInput,
    DivDragHandler,
    DivDragWithPointerLock,
    Button
} from "bbuutoonnss";

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
}

export interface ColourElementProps {
    index: number
    state: ColourElementState
    onRemove: (index: number) => void
    onChange: (index: number, state: ColourElementState) => void
}


const stopPropagation = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
};

export const ColourElement: React.FC<ColourElementProps> = ((props) => {

    const {
        onRemove,
        onChange,
        state,
        index,
    } = props;

    const containerRef = useRef<HTMLDivElement>(null);


    const style = useMemo<CSSProperties>(() => ({
        background: state.colour,
        width: state.width,
        height: state.height,
        left: state.position[0],
        top: state.position[1],
        transform: `rotate(${state.angle}grad)`,
        borderWidth: state.borderWidth,
        borderRadius: state.borderRadius,
        borderColor: state.borderColor,
        borderStyle: state.borderStyle,
        zIndex: state.zIndex,
        mixBlendMode: state.blendMode
    } as CSSProperties), [state]);

    const originStyle = useMemo(() => ({
        width: state.width + state.borderWidth * 2,
        height: state.height + state.borderWidth * 2,
        left: state.position[0],
        top: state.position[1],
        zIndex: state.zIndex,
    }), [state.width, state.height, state.position, state.borderWidth, state.zIndex]);

    const handleParameterChange = React.useCallback((paramName: string, value: any) => {
        onChange(index, {
            ...state,
            [paramName]: value
        });
    }, [onChange, state, index])

    const handleChangeColour = React.useCallback((value) => {
        handleParameterChange('colour', value);
    }, [handleParameterChange]);

    const handlePositionChange = React.useCallback(({x, y}, e, savedValue) => {
        console.log(state);
        // handleParameterChange('width', Math.max(0, savedValue[1] + y));
        // handleParameterChange('angle', savedValue[1] - y);
        handleParameterChange('position', [savedValue[0] + x, savedValue[1] + y])
    }, [handleParameterChange]);

    const handleWidthChange = React.useCallback(({x, y}, e, savedValue) => {
        console.log(state);
        handleParameterChange('width', Math.max(0, savedValue - y));
    }, [handleParameterChange]);

    const handleHeightChange = React.useCallback(({x, y}, e, savedValue) => {

        console.log(state);
        handleParameterChange('height', Math.max(0, savedValue - y));
    }, [handleParameterChange]);

    const handleAngleChange = React.useCallback(({x, y}, e, savedValue) => {
        handleParameterChange('angle', savedValue - y);
    }, [handleParameterChange]);

    const handleRadiusChange = React.useCallback(({x, y}, e, savedValue) => {
        handleParameterChange('borderRadius', Math.max(0, savedValue - y));
    }, [handleParameterChange]);

    const handleBorderWidthChange = React.useCallback(({x, y}, e, savedValue) => {
        handleParameterChange('borderWidth', Math.max(0, savedValue - y));
    }, [handleParameterChange]);

    const handleBorderStyleChange = React.useCallback((e) => {
        handleParameterChange('borderStyle', e.target.value);
    }, [handleParameterChange]);

    const handleBorderColorChange = React.useCallback((value) => {
        handleParameterChange('borderColor', value);
    }, [handleParameterChange])
    const handleZIndexChange = React.useCallback((value) => {
        handleParameterChange('zIndex', value);
    }, [handleParameterChange])
    const handleBlendModeChange = React.useCallback((e) => {
        handleParameterChange('blendMode', e.target.value);
    }, [handleParameterChange])

    const handleRemove = React.useCallback((e) => {
        onRemove(index);
    }, [onRemove, index])

    return (
        <>
            <div
                ref={containerRef}
                className={styles.colourElement}
                style={style}
                onClick={stopPropagation}
            />
            <div
                className={styles.colourElementOrigin}
                style={originStyle}
                onClick={stopPropagation}
            >
                <div className={styles.colourElementControls}>
                    <BlurEnterTextInput
                        changeOnEnter
                        resetOnBlur
                        value={state.colour}
                        onChange={handleChangeColour}
                    />
                    <DivDragHandler<[number, number]>
                        saveValue={state.position}
                        onDrag={handlePositionChange}
                        className={`${styles.colourElementControlHandler} ${styles.colourElementControlHandlerPosition}`}
                    >position{state.position[0]},{state.position[1]}</DivDragHandler>
                    <DivDragWithPointerLock<number>
                        saveValue={state.width}
                        onDrag={handleWidthChange}
                        className={styles.colourElementControlHandler}
                    >width{state.width}</DivDragWithPointerLock>
                    <DivDragWithPointerLock<number>
                        saveValue={state.height}
                        onDrag={handleHeightChange}
                        className={styles.colourElementControlHandler}
                    >height{state.height}</DivDragWithPointerLock>
                    <DivDragWithPointerLock<number>
                        saveValue={state.angle}
                        onDrag={handleAngleChange}
                        className={styles.colourElementControlHandler}
                    >angle{state.angle}</DivDragWithPointerLock>
                    <DivDragWithPointerLock<number>
                        saveValue={state.borderWidth}
                        onDrag={handleBorderWidthChange}
                        className={styles.colourElementControlHandler}
                    >border{state.borderWidth}</DivDragWithPointerLock>
                    <DivDragWithPointerLock<number>
                        saveValue={state.borderRadius}
                        onDrag={handleRadiusChange}
                        className={styles.colourElementControlHandler}
                    >radius{state.borderRadius}</DivDragWithPointerLock>
                    <select
                        value={state.borderStyle}
                        onChange={handleBorderStyleChange}
                    >
                        <option value={'solid'}>solid</option>
                        <option value={'dashed'}>dashed</option>
                        <option value={'dotted'}>dotted</option>
                        <option value={'double'}>double</option>
                        <option value={'hidden'}>hidden</option>
                    </select>
                    <BlurEnterTextInput
                        changeOnEnter
                        resetOnBlur
                        value={state.borderColor}
                        onChange={handleBorderColorChange}
                    />
                    <BlurEnterNumberInput
                        changeOnEnter
                        resetOnBlur
                        value={state.zIndex || undefined}
                        onChange={handleZIndexChange}
                        placeholder={'z-index'}
                    />
                    <select
                        value={state.blendMode}
                        onChange={handleBlendModeChange}
                    >
                        <option value={'normal'}>normal</option>
                        <option value={'multiply'}>multiply</option>
                        <option value={'screen'}>screen</option>
                        <option value={'overlay'}>overlay</option>
                        <option value={'darken'}>darken</option>
                        <option value={'lighten'}>lighten</option>
                        <option value={'color-dodge'}>color-dodge</option>
                        <option value={'color-burn'}>color-burn</option>
                        <option value={'hard-light'}>hard-light</option>
                        <option value={'soft-light'}>soft-light</option>
                        <option value={'difference'}>difference</option>
                        <option value={'exclusion'}>exclusion</option>
                        <option value={'hue'}>hue</option>
                        <option value={'saturation'}>saturation</option>
                        <option value={'color'}>color</option>
                        <option value={'luminosity'}>luminosity</option>
                    </select>
                    <button onClick={handleRemove}>remove</button>
                </div>
            </div>
        </>
    );
});
