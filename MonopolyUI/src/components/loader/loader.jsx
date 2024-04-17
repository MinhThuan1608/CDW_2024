import React from 'react';
import { HashLoader } from 'react-spinners';
import styles from '../../assert/style/loader.module.css'

const Loader = (props) => {

    return props.isLoading && (
        <div className={styles.loaderContainer}>
            <HashLoader color='#8b89ff' />
        </div>
    )
}
export default Loader;