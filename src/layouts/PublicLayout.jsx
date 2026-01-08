import { Outlet } from 'react-router-dom';
import styles from './PublicLayout.module.css';

const PublicLayout = () => {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <Outlet />
            </div>
        </div>
    );
};

export default PublicLayout;
