import * as React from "react";
import {ColourElement, ColourElementState} from "./ColourElement";
import {useCallback, useMemo, useRef, useState} from "react";
import styles from './styles.css';

export interface ColoursPanelProps {
    width: number
    height: number
}

export function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
export function getRandomSize(from , to) {
    return from  + Math.floor(Math.random() * to);
}

export const defaultElementState = {
    colour: 'blue',
    position: [100, 100],
    width: 100,
    height: 100,
    angle: 0,
    borderWidth: 0,
    borderStyle: 'solid',
    borderColor: 'black',
    borderRadius: 0,
    zIndex: 0,
    blendMode: 'normal',
};

export const ColoursPanel: React.FC<ColoursPanelProps> = (props) => {

    const {width, height} = props;

    const style = useMemo(() => ({width, height}), [width, height]);

    const containerRef = useRef<HTMLDivElement>(null);

    const [elements, setElements] = useState<ColourElementState[]>([]);

    const handleRemove = useCallback((index: number) => {
        const newElements = [...elements];
        newElements.splice(index, 1);
        setElements(newElements);
    }, [elements]);

    const handleChange = useCallback((index: number, state: ColourElementState) => {

        setElements(elements => {
            const newElements = [...elements];
            newElements[index] = state;
            // console.log(elements[index], state)
            return newElements
        });
    }, [elements]);

    const handleAddNewElement = useCallback((e) => {
        if (e.target !== containerRef.current)
            return;

        const rect = e.target.getBoundingClientRect();

        setElements(elements => [...elements, {
            ...defaultElementState,
            position: [e.clientX - rect.left, e.clientY - rect.top],
            colour: getRandomColor(),
            borderColor: getRandomColor(),
            width: getRandomSize(97, 222),
            height: getRandomSize(130, 244),
        }]);
    }, [elements]);

    return (
        <div
            ref={containerRef}
            className={styles.coloursPanel}
            style={style}
            onDoubleClick={handleAddNewElement}
        >
            {!elements.length && (
                <div>double click to add colour</div>
            )}
            {elements.map((elementState, index) => {
                return (
                    <ColourElement
                        key={index}
                        index={index}
                        state={elementState}
                        onRemove={handleRemove}
                        onChange={handleChange}
                    />
                )
            })}
        </div>
    );
};
