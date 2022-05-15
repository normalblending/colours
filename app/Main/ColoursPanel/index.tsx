import * as React from "react";
import {ColourElement, ColourElementState} from "./ColourElement";
import {useCallback, useMemo, useRef, useState} from "react";
import {KeyboardJSTrigger, useIsActive, DropFile, readImageFile} from "bbuutoonnss";
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

export function getRandomSize(from, to) {
    return from + Math.floor(Math.random() * to);
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
    text: '',
    font: '',
    fontStyle: '',
    fontSize: 50,
    fontWeight: '',
    textColour: 'black',
    textPosition: [0, 0] as [number, number],
    shadowXYOffset: [0, 0] as [number, number],
    shadowSpread: 0,
    shadowBlur: 0,
    shadowColor: 'black',
    textShadowXYOffset: [0, 0] as [number, number],
    textShadowBlur: 0,
    textShadowColor: 'black',
};

const quadNumberFormat =
    (arr: string) =>
        (string, offset) => string
            .split(((0 + offset) % 4).toString()).join(arr[0])
            .split(((1 + offset) % 4).toString()).join(arr[1])
            .split(((2 + offset) % 4).toString()).join(arr[2])
            .split(((3 + offset) % 4).toString()).join(arr[3]);

export const dateZs = () => {

    const date = new Date();

    let f: string = 'colr';


    return quadNumberFormat(f)(date.getTime().toString(4), 0);

};

export const saveJson = (obj) => {
    var dataURL = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));

    var link = document.createElement("a");
    document.body.appendChild(link); // Firefox requires the link to be in the body :(
    link.href = dataURL;
    link.download = `${dateZs()}.json`;
    link.click();
    document.body.removeChild(link);
};

export const ColoursPanel: React.FC<ColoursPanelProps> = (props) => {

    const {width, height} = props;

    const style = useMemo(() => ({width, height}), [width, height]);

    const [isBlendActive, {handleActivate: blendActivate, handleDeactivate: blendDeactivate}] = useIsActive(true);
    const [isAddActive, {handleActivate: addActivate, handleDeactivate: addDeactivate}] = useIsActive(false);

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


    const handleCopyState = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(JSON.stringify(elements))

        } catch (error) {
            console.error(error)
        }
    }, [elements]);

    const handleSave = useCallback(async () => {
        try {

            saveJson(elements);
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
            const elements = JSON.parse(text);

            if (Array.isArray(elements))
                setElements(elements);
        } catch (error) {
            console.error(error)
        }
    }, []);

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
        var f = files[0];

        if (!f.type.match('application/json')) {
            alert('Not a JSON file!');
        }

        var reader = new FileReader();

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
            '[ i ] - info\n' +
            '[ b ] - mute blending\n' +
            '[ s ] - save to file\n' +
            'drop file - overwrite\n' +
            '[ a ] + drop file - append\n' +
            '[ backspace ] - clear\n' +
            '[ copy ] - copy\n' +
            '[ paste ] - append'
        );
    }, []);

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
                <KeyboardJSTrigger codeValue={'i'} onPress={handleInfo}/>
                {!elements.length && (
                    <>
                        <div>double click to add colour</div>
                        <div>[ copy ] - copy</div>
                        <div>[ paste ] - append</div>
                        <div>[ b ] - mute blending</div>
                        <div>[ s ] - save to file</div>
                        <div>drop file - overwrite</div>
                        <div>[ a ] + drop file - append</div>
                        <div>[ backspace ] - clear</div>
                    </>
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
                        />
                    )
                })}
            </div>
        </DropFile>
    );
};
