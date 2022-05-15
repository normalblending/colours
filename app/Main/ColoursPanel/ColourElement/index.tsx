import * as React from "react";
import {useMemo, useRef, MouseEvent, CSSProperties} from "react";
import styles from './styles.css';
import {
    BlurEnterNumberInput,
    BlurEnterTextInput,
    DivDragHandler,
    DivDragWithPointerLock,
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
    textShadowXYOffset: [number, number]
    textShadowBlur: number
    textShadowColor: string

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

export enum ParameterTypes {
    TextInput = 'TextInput',
    NumberInput = 'NumberInput',
    XYDrag = 'XYDrag',
    XYDragPointerLock = 'XYDragPointerLock',
    XDrag = 'XDrag',
    YDrag = 'yDrag',
    XDragPointerLock = 'XDragPointerLock',
    YDragPointerLock = 'YDragPointerLock',
    SelectArray = 'SelectArray'
}

const parameterComponentsByType = {
    [ParameterTypes.TextInput]: ({name, value, onChange, props}) => {
        const handleChange = React.useCallback((value) => {
            onChange(name, value)
        }, [onChange]);
        return (
            <BlurEnterTextInput
                changeOnEnter
                resetOnBlur
                value={value}
                onChange={handleChange}
                title={props.placeholder}
                {...props}
            />
        );
    },
    [ParameterTypes.NumberInput]: ({name, value, onChange, props}) => {
        const handleChange = React.useCallback((value) => {
            onChange(name, value)
        }, [onChange]);
        return (
            <BlurEnterNumberInput
                changeOnEnter
                resetOnBlur
                value={value || undefined}
                onChange={handleChange}
                title={props.placeholder}
                {...props}
            />
        );
    },
    [ParameterTypes.XYDrag]: ({value, onChange, name, props}) => {
        const handleChange = React.useCallback(({x, y}, e, savedValue) => {
            onChange(name, [savedValue[0] + x, savedValue[1] + y])
        }, [onChange]);
        return (
            <DivDragHandler<[number, number]>
                saveValue={value}
                onDrag={handleChange}
                className={`${styles.colourElementControlHandler} ${styles.colourElementControlHandlerPosition}`}
            >{props?.text || name} {value[0]},{value[1]}</DivDragHandler>
        );
    },
    [ParameterTypes.XYDragPointerLock]: ({value, onChange, name, props}) => {
        const handleChange = React.useCallback(({x, y}, e, savedValue) => {
            onChange(name, [savedValue[0] + x, savedValue[1] + y])
        }, [onChange]);
        return (
            <DivDragWithPointerLock<[number, number]>
                saveValue={value}
                onDrag={handleChange}
                className={`${styles.colourElementControlHandler} ${styles.colourElementControlHandlerPosition}`}
            >{props?.text || name} {value[0]},{value[1]}</DivDragWithPointerLock>
        );
    },
    [ParameterTypes.XDrag]: ({value, onChange, name, props}) => {

        const handleChange = React.useCallback(({x, y}, e, savedValue) => {
            onChange(name, Math.max(0, savedValue + x));
        }, [onChange]);

        return (
            <DivDragHandler<number>
                saveValue={value}
                onDrag={handleChange}
                className={styles.colourElementControlHandler}
            >{props?.text || name} {value}</DivDragHandler>
        );
    },
    [ParameterTypes.YDrag]: ({value, onChange, name, props}) => {

        const handleChange = React.useCallback(({x, y}, e, savedValue) => {
            onChange(name, Math.max(0, savedValue - y));
        }, [onChange]);

        return (
            <DivDragHandler<number>
                saveValue={value}
                onDrag={handleChange}
                className={styles.colourElementControlHandler}
            >{props?.text || name} {value}</DivDragHandler>
        );
    },
    [ParameterTypes.XDragPointerLock]: ({value, onChange, name, props}) => {

        const handleChange = React.useCallback(({x, y}, e, savedValue) => {
            onChange(name, Math.max(0, savedValue + x));
        }, [onChange]);

        return (
            <DivDragWithPointerLock<number>
                saveValue={value}
                onDrag={handleChange}
                className={styles.colourElementControlHandler}
            >{props?.text || name} {value}</DivDragWithPointerLock>
        );
    },
    [ParameterTypes.YDragPointerLock]: ({value, onChange, name, props}) => {

        const handleChange = React.useCallback(({x, y}, e, savedValue) => {
            onChange(name, Math.max(0, savedValue - y));
        }, [onChange]);

        return (
            <DivDragWithPointerLock<number>
                saveValue={value}
                onDrag={handleChange}
                className={styles.colourElementControlHandler}
            >{props?.text || name} {value}</DivDragWithPointerLock>
        );
    },
    [ParameterTypes.SelectArray]: ({value, onChange, name, props}) => {

        const handleChange = React.useCallback((e) => {
            onChange(name, e.target.value);
        }, [onChange]);

        return (
            <select
                value={value}
                onChange={handleChange}
                title={props.title}
            >
                {props.options.map(option => {
                    return <option value={option}>{option}</option>
                })}
            </select>
        );
    },
}

export interface ParameterConfig {
    name: string
    type: ParameterTypes
    props?: any
    visibility?: (state: ColourElementState) => boolean
}

const parametersConfig: ParameterConfig[] = [
    {
        name: 'colour',
        type: ParameterTypes.TextInput,
        props: {placeholder: 'colour'},
    }, {
        name: 'position',
        type: ParameterTypes.XYDrag,
    }, {
        name: 'width',
        type: ParameterTypes.YDragPointerLock,
    }, {
        name: 'height',
        type: ParameterTypes.YDragPointerLock,
    }, {
        name: 'angle',
        type: ParameterTypes.YDragPointerLock,
    }, {
        name: 'borderWidth',
        type: ParameterTypes.YDragPointerLock,
        props: {text: 'border width'},
    }, {
        name: 'borderRadius',
        type: ParameterTypes.YDragPointerLock,
        props: {text: 'border radius'},
    }, {
        name: 'borderStyle',
        type: ParameterTypes.SelectArray,
        props: {
            options: ['solid', 'dashed', 'dotted', 'double', 'hidden'],
            title: 'border style'
        }
    }, {
        name: 'borderColor',
        type: ParameterTypes.TextInput,
        props: {placeholder: 'border colour'},
    }, {
        name: 'zIndex',
        type: ParameterTypes.NumberInput,
        props: {placeholder: 'z-index'},
    }, {
        name: 'blendMode',
        type: ParameterTypes.SelectArray,
        props: {
            options: [
                'normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten',
                'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference',
                'exclusion', 'hue', 'saturation', 'color', 'luminosity',
            ],
            title: 'blend mode'
        }
    }, {
        name: 'text',
        type: ParameterTypes.TextInput,
        props: {placeholder: 'text'},
    }, {
        name: 'fontSize',
        type: ParameterTypes.YDragPointerLock,
        props: {text: 'font size'},
        visibility: ({text}) => !!text,
    }, {
        name: 'textPosition',
        type: ParameterTypes.XYDragPointerLock,
        props: {text: 'text position'},
        visibility: ({text}) => !!text,
    }, {
        name: 'font',
        type: ParameterTypes.TextInput,
        props: {placeholder: 'font family'},
        visibility: ({text}) => !!text,
    }, {
        name: 'fontStyle',
        type: ParameterTypes.TextInput,
        props: {placeholder: 'font style'},
        visibility: ({text}) => !!text,
    }, {
        name: 'fontWeight',
        type: ParameterTypes.TextInput,
        props: {placeholder: 'font weight'},
        visibility: ({text}) => !!text,
    }, {
        name: 'textShadowXYOffset',
        type: ParameterTypes.XYDragPointerLock,
        props: {text: 'text shadow offset'},
        visibility: ({text}) => !!text,
    }, {
        name: 'textShadowBlur',
        type: ParameterTypes.YDragPointerLock,
        props: {text: 'text shadow blur'},
        visibility: ({text}) => !!text,
    }, {
        name: 'textShadowColor',
        type: ParameterTypes.TextInput,
        props: {placeholder: 'text shadow color'},
        visibility: ({text}) => !!text,
    }, {
        name: 'shadowXYOffset',
        type: ParameterTypes.XYDragPointerLock,
        props: {text: 'shadow offset'},
    }, {
        name: 'shadowSpread',
        type: ParameterTypes.YDragPointerLock,
        props: {text: 'shadow spread'},
    }, {
        name: 'shadowBlur',
        type: ParameterTypes.YDragPointerLock,
        props: {text: 'shadow blur'},
    }, {
        name: 'shadowColor',
        type: ParameterTypes.TextInput,
        props: {placeholder: 'shadow color'},
    },
];

export const ColourElement: React.FC<ColourElementProps> = ((props) => {

    const {
        onRemove,
        onChange,
        state,
        index,
    } = props;

    const containerRef = useRef<HTMLDivElement>(null);

    const originStyle = useMemo(() => ({
        width: state.width + state.borderWidth * 2,
        height: state.height + state.borderWidth * 2,
        left: state.position[0],
        top: state.position[1],
        zIndex: state.zIndex,
        mixBlendMode: state.blendMode,
    } as CSSProperties), [state]);

    const style = useMemo<CSSProperties>(() => ({
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
        boxShadow: `${state.shadowXYOffset[0]}px ${state.shadowXYOffset[1]}px ${state.shadowBlur}px ${state.shadowSpread}px ${state.shadowColor}`
    } as CSSProperties), [state]);

    const textStyle = useMemo<CSSProperties>(() => ({
        fontSize: state.fontSize,
        fontFamily: state.font,
        fontStyle: state.fontStyle,
        fontWeight: state.fontWeight,
        color: state.textColour,
        position: 'absolute',
        left: state.textPosition[0],
        top: state.textPosition[1],
        textShadow: `${state.textShadowXYOffset[0]}px ${state.textShadowXYOffset[1]}px ${state.textShadowBlur}px ${state.textShadowColor}`
    } as CSSProperties), [state]);


    const handleParameterChange = React.useCallback((paramName: string, value: any) => {
        onChange(index, {
            ...state,
            [paramName]: value
        });
    }, [onChange, state, index])

    const handleRemove = React.useCallback((e) => {
        onRemove(index);
    }, [onRemove, index])

    return (
        <>

            <div
                className={styles.colourElementOrigin}
                style={originStyle}
                onClick={stopPropagation}
            >
                <div
                    ref={containerRef}
                    className={styles.colourElement}
                    style={style}
                    onClick={stopPropagation}
                >
                    <div style={textStyle}>{state.text}</div>
                </div>
                <div className={styles.colourElementControls}>
                    {parametersConfig.map(({type, name, props, visibility}) => {
                        const Component = parameterComponentsByType[type];
                        const isVisible = !visibility || visibility(state);

                        return isVisible && (
                            <Component
                                key={name}
                                value={state[name]}
                                props={props}
                                name={name}
                                onChange={handleParameterChange}
                            />
                        )
                    })}

                    <button onClick={handleRemove}>delete</button>
                </div>
            </div>
        </>
    );
});
