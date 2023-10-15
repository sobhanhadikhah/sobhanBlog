/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
/* eslint-disable prettier/prettier */
import React, { useEffect, type ReactNode } from 'react';
import styles from './sky.module.css';

interface Props {
  children: ReactNode;
}

const Sky: React.FC<Props> = ({ children }: Props) => {
  useEffect(() => {
    const sky = document.querySelector(`.${styles.sky}`);

    if (!sky) {
      return; // Return early if the element is not found
    }

    function createStar() {
      const star = document.createElement('div');
      star.className = styles.star;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      star.style.left = `${left}%`;
      star.style.top = `${top}%`;
      sky.appendChild(star);

      // Add a class for flickering with a random delay
      star.style.animationDelay = `${Math.random() * 2000}ms`; // Random delay for flickering
    }

    for (let i = 0; i < 100; i++) {
      createStar();
    }
  }, []);

  return (
    <div className={styles.sky}>
      {children}
    </div>
  );
};

export default Sky;
