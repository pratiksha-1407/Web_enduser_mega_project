import clsx from 'clsx';
import { ArrowUpRight, ArrowDownRight, AlertCircle } from 'lucide-react';
import styles from './StatCard.module.css';

const StatCard = ({ title, value, icon: Icon, color, growth, isWarning, subtitle }) => {
    const isPositive = growth >= 0;

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={clsx(styles.iconWrapper, styles[color])}>
                    <Icon size={20} />
                </div>
                {(growth !== undefined || isWarning) && (
                    <div className={clsx(styles.badge, isWarning ? styles.warning : (isPositive ? styles.success : styles.danger))}>
                        {isWarning ? (
                            <AlertCircle size={12} />
                        ) : (
                            isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />
                        )}
                        <span>{isWarning ? 'Attention' : `${Math.abs(growth)}%`}</span>
                    </div>
                )}
            </div>

            <div className={styles.content}>
                <div className={styles.value}>{value}</div>
                <div className={styles.title}>{title}</div>
                {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
            </div>
        </div>
    );
};

export default StatCard;
