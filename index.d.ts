declare module "*.png" {
    const value: any;
    export default value;
}

declare module '*.glsl' {
    const value: string
    export default value
}

declare module '*.css' {
    const classes: { [key: string]: string };
    export default classes;
}