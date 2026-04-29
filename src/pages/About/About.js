import React from 'react';
import { Link } from "react-router-dom";
import { useDotGrid, DotGrid } from "../../hooks/useDotGrid";
import { useSA } from '../../hooks/useScrollAnimate/useScrollAnimate';
import './About.css';

// Assets
import handleDots from "../../assets/images/handle-dots.svg";
import arrowDown from "../../assets/images/arrow-down.svg";
import arrowRight from "../../assets/images/arrow-right.svg";

function About() {
  useDotGrid();  
  useSA();

  return (
    <section className='section section__hero section__grain --grain-medium section-padding' aria-label='Contact Heading and Introduction'>
      <div className='section__decor'>
        <DotGrid color='surface' pattern='scatter' size='small' cols={30} count={500} className='backdrop-dots hidden-xs' />
        
        <div className='decor__shape dots--1' sa='float float-y float-y-loop delay-1000'>
          <img src={handleDots} width='52' height='33' alt='Handle dots' sa='up-long glacial delay-800' />
        </div>
        <div className='decor__shape dots--2' sa='float float-y float-y-loop delay-1200'>
          <img src={handleDots} width='52' height='33' alt='Handle dots' sa='down-long glacial delay-1000' />
        </div>
        <div className='decor__shape arrow-down-svg arrow-down--1' sa='float float-x float-x-loop delay-1400'>
          <img src={arrowRight} width='54' height='16' alt='Arrow down drop' sa='right-long glacial delay-1200' />
        </div>
        <div className='decor__shape arrow-down-svg arrow-down--2' sa='float float-y float-y-loop delay-1600'>
          <img src={arrowDown} width='16' height='54' alt='Arrow down drop' sa='down-long glacial delay-1400' />
        </div>
      </div>
      <div className='hero__content flex-all flex-vert-bottom h-full'>
        <div className='content__left' sa='fade glacial'>
          <h1 className='heading'>Building Thoughtful Web Experiences</h1>
          <p className='text-muted'>I design and develop fast, scalable, and user-focused websites with an emphasis on clean code and performance.</p>
          <Link to='/contact' className='btn btn-primary' data-cursor='light'>
            <span className='btn__text'>Reach Out</span>
            <span className='btn__arrow'>
              <svg xmlns='http://www.w3.org/2000/svg' width='15' height='16' viewBox='0 0 15 16' fill='none'>
                <g clipPath='url(#clip0_388_188)'>
                  <path
                    d='M12.6346 2H5.3634C5.2665 2 5.17356 2.0417 5.10503 2.11593C5.03651 2.19017 4.99801 2.29085 4.99801 2.39582C4.99801 2.5008 5.03651 2.60148 5.10503 2.67571C5.17356 2.74995 5.2665 2.79165 5.3634 2.79165H11.7545L1.10661 14.3269C1.07281 14.3635 1.046 14.407 1.02771 14.4548C1.00941 14.5027 1 14.5539 1 14.6057C1 14.6575 1.00941 14.7088 1.02771 14.7566C1.046 14.8044 1.07281 14.8479 1.10661 14.8845C1.14041 14.9211 1.18053 14.9502 1.22469 14.97C1.26885 14.9898 1.31619 15 1.36398 15C1.41178 15 1.45911 14.9898 1.50328 14.97C1.54744 14.9502 1.58756 14.9211 1.62136 14.8845L12.2692 3.34855V10.2726C12.2692 10.3776 12.3077 10.4782 12.3762 10.5525C12.4448 10.6267 12.5377 10.6684 12.6346 10.6684C12.7315 10.6684 12.8245 10.6267 12.893 10.5525C12.9615 10.4782 13 10.3776 13 10.2726V2.39438C12.9993 2.28977 12.9605 2.18968 12.8921 2.11584C12.8237 2.042 12.7312 2.00038 12.6346 2Z'
                    fill='var(--color-text-primary)'
                  />
                </g>

                <defs>
                  <clipPath id='clip0_388_188'>
                    <rect width='15' height='16' fill='white' />
                  </clipPath>
                </defs>
              </svg>
            </span>
          </Link>          
        </div>
      </div>
    </section>
  );
}

export default About;