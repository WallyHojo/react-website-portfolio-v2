import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import heroBg from "../../assets/images/hero_bg.webp";
import diagnalLines from "../../assets/images/diagnal-lines.svg";
import handleDots from "../../assets/images/handle-dots.svg";
import arrowDownDrop1f from "../../assets/images/arrow-down-drop-1f1f1f.svg";
import arrowDownDrop2e from "../../assets/images/arrow-down-drop-2e2e2e.svg";

function Home() {
  const headings = [
    "Design Systems",
    "Accessible Interfaces",
    "Performance-Focused UI",
    "Frontend Architecture",
  ];

  const typingSpeed = 80;
  const deletingSpeed = 40;
  const pauseTime = 1500;

  const [displayText, setDisplayText] = useState("");
  const headingIndex = useRef(0);
  const charIndex = useRef(0);
  const isDeleting = useRef(false);
  const paused = useRef(false);
  const timeoutId = useRef(null);

  useEffect(() => {
    function typeEffect() {
      if (paused.current) return;

      const current = headings[headingIndex.current];
      const text = current.substring(0, charIndex.current);
      setDisplayText(text || "\u00A0");

      let delay = typingSpeed;

      if (!isDeleting.current && charIndex.current < current.length) {
        charIndex.current++;
      } else if (isDeleting.current && charIndex.current > 0) {
        charIndex.current--;
        delay = deletingSpeed;
      } else if (!isDeleting.current) {
        isDeleting.current = true;
        delay = pauseTime;
      } else {
        isDeleting.current = false;
        headingIndex.current = (headingIndex.current + 1) % headings.length;
      }

      timeoutId.current = setTimeout(typeEffect, delay);
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        paused.current = true;
      } else {
        paused.current = false;
        typeEffect();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    typeEffect();

    return () => {
      clearTimeout(timeoutId.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <section className="section section__hero section-grain grain-medium section-padding height-viewport">
      <div className="hero__content flex-all flex-vert-bottom height-full">
        <div className="hero-content__left" sa="mirror up-long fade glacial">
          <h1 className="heading" sa="mirror up slower delay-200">{displayText}</h1>
          <h2 className="h3 subheading" sa="mirror up slower delay-400">
            <strong>Hi, I'm Walter Carlson, a UI Engineer</strong> focused on
            building fast, accessible, and scalable user interfaces that bridge
            design and engineering.
          </h2>
          <p className="text-muted" sa="mirror up glacial delay-600">
            With a strong focus on performance, usability, and maintainable
            code, I transform design concepts into polished, production-ready
            interfaces that deliver consistent experiences across devices.
          </p>
          <Link to="/Contact" className="btn btn-primary" sa="mirror up delay-400">
            <span className="btn__text">Let's Talk</span>
            <span className="btn__arrow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="16"
                viewBox="0 0 15 16"
                fill="none"
              >
                <g clipPath="url(#clip0_388_188)">
                  <path
                    d="M12.6346 2H5.3634C5.2665 2 5.17356 2.0417 5.10503 2.11593C5.03651 2.19017 4.99801 2.29085 4.99801 2.39582C4.99801 2.5008 5.03651 2.60148 5.10503 2.67571C5.17356 2.74995 5.2665 2.79165 5.3634 2.79165H11.7545L1.10661 14.3269C1.07281 14.3635 1.046 14.407 1.02771 14.4548C1.00941 14.5027 1 14.5539 1 14.6057C1 14.6575 1.00941 14.7088 1.02771 14.7566C1.046 14.8044 1.07281 14.8479 1.10661 14.8845C1.14041 14.9211 1.18053 14.9502 1.22469 14.97C1.26885 14.9898 1.31619 15 1.36398 15C1.41178 15 1.45911 14.9898 1.50328 14.97C1.54744 14.9502 1.58756 14.9211 1.62136 14.8845L12.2692 3.34855V10.2726C12.2692 10.3776 12.3077 10.4782 12.3762 10.5525C12.4448 10.6267 12.5377 10.6684 12.6346 10.6684C12.7315 10.6684 12.8245 10.6267 12.893 10.5525C12.9615 10.4782 13 10.3776 13 10.2726V2.39438C12.9993 2.28977 12.9605 2.18968 12.8921 2.11584C12.8237 2.042 12.7312 2.00038 12.6346 2Z"
                    fill="#2979FF"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_388_188">
                    <rect width="15" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </span>
          </Link>
        </div>
      </div>

      <div className="hero__decor">
        <svg
          className="hero__shape slats-svg"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <mask
              id="slats-mask"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="100%"
              height="100%"
            >
              <rect
                x="500"
                y="-60"
                width="140"
                height="100vh"
                rx="70"
                ry="70"
                fill="white"
                transform="rotate(45, 770, 170)"
              ></rect>
              <rect
                x="705"
                y="-60"
                width="140"
                height="100vh"
                rx="70"
                ry="70"
                fill="white"
                transform="rotate(45, 970, 205)"
              ></rect>
              <rect
                x="930"
                y="60"
                width="140"
                height="130vh"
                rx="70"
                ry="70"
                fill="white"
                transform="rotate(45, 1170, 210)"
              ></rect>
              <rect
                x="1165"
                y="200"
                width="140"
                height="100vh"
                rx="70"
                ry="70"
                fill="white"
                transform="rotate(45, 1370, 200)"
              ></rect>
              <rect x="1335" y="60" width="140" height="100vh" rx="70" ry="70" fill="white" transform="rotate(45, 1370, 200)"></rect>
            </mask>
          </defs>
          <image
            href={heroBg}
            x="0"
            y="0"
            width="130%"
            height="160%"
            preserveAspectRatio="xMidYMid slice"
            mask="url(#slats-mask)"
          />
        </svg>

        <div className="hero__shape dots-svg dots--1" sa="mirror fade glacial delay-200">
          <img src={handleDots} alt="Handle dots"clipPath />
        </div>
        <div className="hero__shape dots-svg dots--2" sa="mirror fade glacial delay-400">
          <img src={handleDots} alt="Handle dots"clipPath />
        </div>
        <div className="hero__shape arrow-down-svg arrow-down--1" sa="mirror fade glacial delay-600">
          <img src={arrowDownDrop1f} alt="Arrow down drop"clipPath />
        </div>
        <div className="hero__shape arrow-down-svg arrow-down--2" sa="mirror fade glacial delay-800">
          <img src={arrowDownDrop2e} alt="Arrow down drop"clipPath />
        </div>
        <div className="hero__shape slats-bg">
          <img
            src={diagnalLines}
            alt="diagonal lines background image"
            width="416"
            height="354"
          />
        </div>
      </div>      
    </section>
  );
}

export default Home;
