import * as React from "react";
import {useMemo} from "react";
import styles from "../styles.css";
import {ColourElementState, ParameterTypes} from "../types";
import {BlurEnterNumberInput, BlurEnterTextInput, DivDragHandler, DivDragWithPointerLock} from "bbuutoonnss";

export interface ParameterInputComponentProps {
    name: string
    value: any

    onChange(name: string, value: any)

    props: any
}

const rotateVector = ({x, y}, angle) => {
    const ang = -angle * (Math.PI / 180);
    const cos = Math.cos(ang);
    const sin = Math.sin(ang);
    return {x: x * cos - y * sin, y: x * sin + y * cos};
};

export interface ParameterComponentProps {
    name: string
    type: ParameterTypes
    props?: any
    propsByState?: (state: ColourElementState) => any
    visibility?: (state: ColourElementState) => boolean
    state: ColourElementState
    onChange: (name: string, value: any) => void
}

export const ParameterComponent: React.FC<ParameterComponentProps> = (props) => {
    const {
        state,
        onChange,
        type,
        name,
        props: inputProps,
        propsByState,
        visibility
    } = props;

    const Component = inputComponentsByParameterType[type];
    const isVisible = !visibility || visibility(state);

    const _inputProps = useMemo<any>(() => ({
        ...inputProps,
        ...(propsByState?.(state) || {})
    }), [inputProps, propsByState, state]);

    return (
        isVisible ?
            <Component
                value={state[name]}
                props={_inputProps}
                name={name}
                onChange={onChange}
            /> : null
    );
};

export const inputComponentsByParameterType: {
    [type: string]: React.ComponentType<ParameterInputComponentProps>
} = {
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

        const angle = props?.angle || 0;
        const handleChange = React.useCallback((vector, e, savedValue) => {
            const {x, y} = rotateVector(vector, angle)
            onChange(name, [savedValue[0] + x, savedValue[1] + y])
        }, [onChange, angle]);
        return (
            <DivDragWithPointerLock<[number, number]>
                saveValue={value}
                onDrag={handleChange}
                className={`${styles.colourElementControlHandler} ${styles.colourElementControlHandlerPosition}`}
            >{props?.text || name} {value[0].toFixed(0)},{value[1].toFixed(0)}</DivDragWithPointerLock>
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
                    return <option key={option} value={option}>{option}</option>
                })}
            </select>
        );
    },
    [ParameterTypes.Checkbox]: ({value, onChange, name, props}) => {

        const handleChange = React.useCallback((e) => {
            onChange(name, !value);
        }, [onChange, value]);

        return (
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={value}
                        onChange={handleChange}
                    />
                    {props?.text || name}
                </label>
            </div>
        );
    },
}