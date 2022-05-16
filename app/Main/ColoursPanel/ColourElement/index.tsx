import * as React from "react";
import {MouseEvent, useMemo} from "react";
import styles from './styles.css';
import {ColourElementState} from "./types";
import {DivDragHandler} from "bbuutoonnss";
import {ParameterComponent} from "./InputComponent";
import {parametersConfig} from "./configureParameters";
import {getStyles} from "./configureStyles";

export interface ColourElementProps {
    index: number
    state: ColourElementState
    onRemove: (index: number) => void
    onChange: (index: number, state: ColourElementState) => void
    isBlendActive: boolean
    onToBack: (index: number) => void
    onToFront: (index: number) => void
}

const stopPropagation = (e: MouseEvent<HTMLDivElement>) => e.stopPropagation();

export const ColourElement: React.FC<ColourElementProps> = ((props) => {

    const {
        onRemove,
        onChange,
        state,
        index,
        isBlendActive,
        onToFront,
        onToBack
    } = props;

    const elementStyles = useMemo(() => {
        return getStyles(state, isBlendActive)
    }, [state, isBlendActive]);


    const handleParameterChange = React.useCallback((paramName: string, value: any) => {
        onChange(index, {
            ...state,
            [paramName]: value
        });
    }, [onChange, state, index])

    const handlePositionChange = React.useCallback(({x, y}, e, savedValue) => {
        handleParameterChange('position', [savedValue[0] + x, savedValue[1] + y])
    }, [handleParameterChange])

    const handleRemove = React.useCallback((e) => {
        onRemove(index);
    }, [onRemove, index])

    const handleToBack = React.useCallback(() => {
        onToBack(index);
    }, [onToBack, index])

    const handleToFront = React.useCallback(() => {
        onToFront(index);
    }, [onToFront])

    return (
        <>
            <div
                className={styles.colourElementOrigin}
                style={elementStyles.origin}
                onClick={stopPropagation}
            >
                <DivDragHandler<[number, number]>
                    className={`${styles.colourElement} ${styles.positionBigHandler}`}
                    style={elementStyles.main}
                    onClick={stopPropagation}
                    saveValue={state.position}
                    onDrag={handlePositionChange}
                >
                    <div style={elementStyles.text}>
                        {state.text}
                    </div>
                </DivDragHandler>
                <div className={styles.colourElementControls}>
                    {parametersConfig.map(({name, type, props, propsByState, visibility}) => {
                        return (
                            <ParameterComponent
                                name={name}
                                type={type}
                                visibility={visibility}
                                state={state}
                                props={props}
                                propsByState={propsByState}
                                onChange={handleParameterChange}
                            />
                        )
                    })}

                    <button onClick={handleToFront}>up</button>
                    <button onClick={handleToBack}>down</button>
                    <button onClick={handleRemove}>delete</button>
                </div>
            </div>
        </>
    );
});
export {defaultElementState} from "./defaultState";