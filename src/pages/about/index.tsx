/* eslint-disable prettier/prettier */
import { Envelope, GithubLogo, LinkedinLogo } from '@phosphor-icons/react';
import Image from 'next/image';
import { type ReactNode } from 'react';
import MainLayout from '~/components/layouts/main';

export default function About(){
  return (
    <div className='grid place-content-center items-center justify-center ' > 
      <h2 className='text-center text-9xl my-8 font-bold ' >I Made This.</h2>
      <div className='flex flex-col md:flex-row items-center  gap-3' >
      <Image
        src="https://sobhanblog.storage.iran.liara.space/profile/photo1698740014.jpeg"
        alt='sobhan-hadikhah'
        width={300} height={300}
        className='rounded-full ring-1 ring-purple-600 '
          />
      <div className='flex flex-col items-center text-justify gap-3 ' >
      <p className='mx-3 md:mx-0' >
      Greetings, I'm Sobhan Hadikhah, the mind behind this website, where I've embarked on a journey of discovery and education. My programming journey began in 2020, and since then, I've developed a profound passion for this craft. My focus primarily revolves around React and Next, with a keen eye for embracing novel subjects. I'm dedicated to expanding my knowledge and becoming well-versed.

In addition to my fondness for frontend and backend programming, I've had the privilege of spearheading successful projects within the corporate sphere, all of which hold a special place in my heart. Collaborating with diverse and dynamic teams exhilarates me, as it offers invaluable learning opportunities.

I genuinely relish engaging in meaningful dialogues and look forward to connecting with like-minded individuals. Feel free to reach out, and let's share our enthusiasm for technology and innovation.
      </p>
      <p className='mx-3 text-center right text-lg font-semibold ' >
و ما زمستان دیگری را سپری خواهیم کرد؛ 
با عصیان بزرگی که در درونمان هست و تنها چیزی‌ که گرممان می‌دارد آتش مقدس امیدواری‌ست.
      </p>
      <div className='flex gap-3 ' >
          <a href="https://github.com/sobhanhadikhah/sobhanBlog"
          target='_blank'
          >
          <GithubLogo size={36} />
          </a>
          <a href={`mailto:hadikhahs@gmail.com`}
          target='_blank'
          >
          <Envelope size={36} />
          </a>
          <a href="https://www.linkedin.com/in/sobhan-hadikhah-515a90258"
          target='_blank'
          >
          <LinkedinLogo size={36} />
          </a>
      </div>
      </div>
      </div>
    </div>
  )
};

About.getLayout = function getLayout(page: ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

