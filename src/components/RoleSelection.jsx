import React from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../global/theme';
import styles from './RoleSelection.module.css';

const RoleSelection = () => {
  const navigate = useNavigate();

  const roles = [
    { id: 'employee', title: 'Enterprise Employee', icon: '👥', color: theme.colors.primaryBlue, route: '/login' },
    { id: 'marketing', title: 'Marketing Manager', icon: '📊', color: theme.colors.success, route: '/login' },
    { id: 'production', title: 'Production Manager', icon: '🏭', color: theme.colors.warning, route: '/login' },
    { id: 'owner', title: 'Enterprise Owner', icon: '💼', color: theme.colors.danger, route: '/login' },
  ];

  const handleRoleSelect = (roleId) => {
    localStorage.setItem('selectedRole', roleId);
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>

        {/* Left Section (Header) */}
        <section className={styles.keyInfo}>
          <h1 className={styles.heading}>
            Cattle Feed
            <br />
            Management System
          </h1>
          <p className={styles.subHeading}>
            Streamline operations, track performance, and make data-driven decisions
            with our centralized enterprise dashboard.
          </p>
        </section>

        {/* Right Section (Cards Grid) */}
        <div className={styles.cardsGrid}>
          {roles.map((role) => (
            <div
              key={role.id}
              className={styles.roleCard}
              onClick={() => handleRoleSelect(role.id)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && handleRoleSelect(role.id)}
            >
              {/* Decorative Background Circle */}
              <div
                className={styles.decorativeBg}
                style={{ color: role.color }}
              />

              <div
                className={styles.iconBox}
                style={{
                  backgroundColor: `${role.color}15`,
                  color: role.color
                }}
              >
                {role.icon}
              </div>

              <h2 className={styles.cardTitle}>{role.title}</h2>

              <div className={styles.cardAction}>
                Access Dashboard <span>→</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default RoleSelection;
