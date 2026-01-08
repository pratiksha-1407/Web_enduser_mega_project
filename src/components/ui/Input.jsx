import clsx from 'clsx';
import styles from './Input.module.css';

const Input = ({
    label,
    error,
    icon: Icon,
    className,
    ...props
}) => {
    return (
        <div className={clsx(styles.wrapper, className)}>
            {label && <label className={styles.label}>{label}</label>}
            <div className={styles.inputContainer}>
                {Icon && <Icon className={styles.icon} size={20} />}
                <input
                    className={clsx(styles.input, Icon && styles.hasIcon, error && styles.hasError)}
                    {...props}
                />
            </div>
            {error && <span className={styles.errorText}>{error}</span>}
        </div>
    );
};

export default Input;
