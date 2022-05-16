import React, {useEffect, useMemo} from "react";
import styles from './styles.css';
import {ColoursPanel} from "./ColoursPanel";

export interface MainProps {

}

export const Main: React.FC<MainProps> = (props) => {

    const [size, setSize] = React.useState<[number, number]>([500, 500]);

    const resizeHandler = React.useCallback((e) => {
        setSize([window.innerWidth, window.innerHeight]);
    }, []);

    useEffect(() => {
        setSize([window.innerWidth, window.innerHeight]);

        window.addEventListener('resize', resizeHandler);
        return () => {
            window.removeEventListener('resize', resizeHandler);
        }
    }, []);

    return (
        <div className={styles.coloursWorkspace}>
            <ColoursPanel
                width={size[0]}
                height={size[1]}
            />
        </div>
    );
};
