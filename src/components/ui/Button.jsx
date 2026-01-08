import clsx from 'clsx';
import { Loader2 } from 'lucide-react';
import styles from './Button.module.css';

const Button = ({
    children,
    variant = 'primary',
    loading = false,
    disabled,
    className,
    ...props
}) => {
    return (
        <button
            className={clsx(styles.button, styles[variant], className)}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <Loader2 className={styles.spinner} size={18} />}
            {children}
        </button>
    );
};

export default Button;
