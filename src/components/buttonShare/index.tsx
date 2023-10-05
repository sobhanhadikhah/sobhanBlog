/* eslint-disable prettier/prettier */
import { ShareNetwork } from '@phosphor-icons/react';
import React from 'react';

type Props = {
    title:string,
    content:string,
    sizeIcon?:number,


};

function Share({sizeIcon=28,}: Props) {
    const handleShare = async () => {
        try {
          if (navigator.share) {
            await navigator.share({
              title: 'Share Example',
              text: 'Check out this awesome website!',
              url: window.location.href,
            });
            console.log('Successfully shared');
          } else {
            console.log('Web Share API not supported.');
          }
        } catch (error) {
          console.error('Error sharing:', error);
        }
      };
  return <button type='button' onClick={()=> void handleShare()}> <ShareNetwork size={sizeIcon} /></button>;
}

export default Share;
