import * as React from "react";
import {useCallback, useMemo, useRef, useState} from "react";
import {ColourElement, defaultElementState} from "./ColourElement";
import {DropFile, KeyboardJSTrigger, useBoolean, quadNumberFormat, saveJson, getRandomColor} from "bbuutoonnss";
import styles from './styles.css';
import {ColourElementState} from "./ColourElement/types";

export interface ColoursPanelProps {
    width: number
    height: number
}

export const getRandomSize = (from, to) => from + Math.floor(Math.random() * to);

export const filename = () => quadNumberFormat('colr')((new Date()).getTime().toString(4), 0);

export const ColoursPanel: React.FC<ColoursPanelProps> = (props) => {

    const {width, height} = props;

    const style = useMemo(() => ({width, height}), [width, height]);

    const [isBlendActive, blendActivate, blendDeactivate] = useBoolean(true);
    const [isAddActive, addActivate, addDeactivate] = useBoolean(false);

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


    const handleCopyState = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(JSON.stringify(elements))
        } catch (error) {
            console.error(error)
        }
    }, [elements]);

    const handleSave = useCallback(async () => {
        try {
            saveJson(filename(), elements);
        } catch (error) {
            console.error(error)
        }
    }, [elements]);
    const handleClear = useCallback(async () => {
        setElements([]);
    }, [setElements]);

    const handlePasteState = useCallback(async () => {
        const text = await navigator.clipboard.readText();
        try {
            const newElements = JSON.parse(text);

            if (Array.isArray(elements)) {
                setElements([...elements, ...newElements]);
            }
        } catch (error) {
            console.error(error)
        }
    }, [elements]);

    React.useEffect(() => {
        document.addEventListener('paste', handlePasteState);
        return () => {
            document.removeEventListener('paste', handlePasteState);
        };
    }, [handlePasteState]);

    React.useEffect(() => {
        document.addEventListener('copy', handleCopyState);
        return () => {
            document.removeEventListener('copy', handleCopyState);
        };
    }, [handleCopyState]);

    const handleDropFiles = useCallback(async (files) => {
        const f = files[0];

        if (!f.type.match('application/json')) {
            alert('Not a JSON file!');
        }

        const reader = new FileReader();

        reader.onload = (function (theFile) {
            return function (e) {
                try {
                    const newElements = JSON.parse(e.target.result);
                    setElements(isAddActive ? [...elements, ...newElements] : newElements);
                } catch (error) {

                }
            };
        })(f);

        reader.readAsText(f);

    }, [elements, isAddActive]);

    const handleInfo = useCallback(() => {
        alert(
            ''
        );
    }, []);

    const handleToBack = useCallback((index) => {
        if (index > 0) {

            setElements(elements => {
                const newElements = [...elements];
                const temp = newElements[index - 1];
                newElements[index - 1] = newElements[index];
                newElements[index] = temp;
                return newElements;
            })
        }
    }, []);

    const handleToFront = useCallback((index) => {
        if (index < elements.length - 1) {

            setElements(elements => {
                const newElements = [...elements];
                const temp = newElements[index + 1];
                newElements[index + 1] = newElements[index];
                newElements[index] = temp;
                return newElements;
            })
        }
    }, [elements]);

    return (
        <DropFile onDrop={handleDropFiles}>
            <div
                ref={containerRef}
                className={styles.coloursPanel}
                style={style}
                onDoubleClick={handleAddNewElement}
            >
                <KeyboardJSTrigger codeValue={'a'} onPress={addActivate} onRelease={addDeactivate}/>
                <KeyboardJSTrigger codeValue={'b'} onPress={blendDeactivate} onRelease={blendActivate}/>
                <KeyboardJSTrigger codeValue={'s'} onPress={handleSave}/>
                <KeyboardJSTrigger keyValue={'Backspace'} onPress={handleClear}/>
                {/*<KeyboardJSTrigger codeValue={'i'} onPress={handleInfo}/>*/}
                {!elements.length && (
                    <div className={styles.noEvents}>
                        <div>double click to add colour</div>
                        <div>[ copy ] - copy</div>
                        <div>[ paste ] - append</div>
                        <div>[ b ] - mute blending</div>
                        <div>[ s ] - save to file</div>
                        <div>drop file - overwrite</div>
                        <div>[ a ] + drop file - append</div>
                        <div>[ backspace ] - clear</div>
                    </div>
                )}
                {elements.map((elementState, index) => {
                    return (
                        <ColourElement
                            isBlendActive={isBlendActive}
                            key={index}
                            index={index}
                            state={elementState}
                            onRemove={handleRemove}
                            onChange={handleChange}
                            onToBack={handleToBack}
                            onToFront={handleToFront}
                        />
                    )
                })}
            </div>
        </DropFile>
    );
};
