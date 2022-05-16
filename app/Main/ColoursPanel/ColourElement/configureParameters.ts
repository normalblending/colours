import {ColourElementState, ParameterConfig, ParameterTypes} from "./types";

export const parametersConfig: ParameterConfig[] = [
    {
        name: 'colour',
        type: ParameterTypes.TextInput,
        props: {
            placeholder: 'colour'
        },
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
        props: {
            placeholder: 'border colour'
        },
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
        name: 'textColour',
        type: ParameterTypes.TextInput,
        props: {
            placeholder: 'text color'
        },
        visibility: ({text}) => !!text,
    }, {
        name: 'fontSize',
        type: ParameterTypes.YDragPointerLock,
        props: {text: 'font size'},
        visibility: ({text}) => !!text,
    }, {
        name: 'textPosition',
        type: ParameterTypes.XYDragPointerLock,
        props: {text: 'text position'},
        propsByState: (state: ColourElementState) => ({
            angle: state.angle
        }),
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
        propsByState: (state: ColourElementState) => ({
            angle: state.angle
        })
    }, {
        name: 'textShadowBlur',
        type: ParameterTypes.YDragPointerLock,
        props: {text: 'text shadow blur'},
        visibility: ({text}) => !!text,
    }, {
        name: 'textShadowColor',
        type: ParameterTypes.TextInput,
        props: {
            placeholder: 'text shadow color'
        },
        visibility: ({text}) => !!text,
    }, {
        name: 'shadowXYOffset',
        type: ParameterTypes.XYDragPointerLock,
        props: {text: 'shadow offset'},
        propsByState: (state: ColourElementState) => ({
            angle: state.angle
        })
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
        props: {
            placeholder: 'shadow color'
        },
    },{
        name: 'shadowInset',
        type: ParameterTypes.Checkbox,
        props: {
            text: 'inset shadow'
        },
    },
];