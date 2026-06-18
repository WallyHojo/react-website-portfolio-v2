import { Link } from 'react-router-dom';
import { forwardRef } from 'react';

import "./Buttons.css";

const ArrowPrimary = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="15" 
    height="16" 
    viewBox="0 0 15 16" 
    fill="none" 
    aria-hidden="true"
  >
    <path d="M12.6346 2H5.3634C5.2665 2 5.17356 2.0417 5.10503 2.11593C5.03651 2.19017 4.99801 2.29085 4.99801 2.39582C4.99801 2.5008 5.03651 2.60148 5.10503 2.67571C5.17356 2.74995 5.2665 2.79165 5.3634 2.79165H11.7545L1.10661 14.3269C1.07281 14.3635 1.046 14.407 1.02771 14.4548C1.00941 14.5027 1 14.5539 1 14.6057C1 14.6575 1.00941 14.7088 1.02771 14.7566C1.046 14.8044 1.07281 14.8479 1.10661 14.8845C1.14041 14.9211 1.18053 14.9502 1.22469 14.97C1.26885 14.9898 1.31619 15 1.36398 15C1.41178 15 1.45911 14.9898 1.50328 14.97C1.54744 14.9502 1.58756 14.9211 1.62136 14.8845L12.2692 3.34855V10.2726C12.2692 10.3776 12.3077 10.4782 12.3762 10.5525C12.4448 10.6267 12.5377 10.6684 12.6346 10.6684C12.7315 10.6684 12.8245 10.6267 12.893 10.5525C12.9615 10.4782 13 10.3776 13 10.2726V2.39438C12.9993 2.28977 12.9605 2.18968 12.8921 2.11584C12.8237 2.042 12.7312 2.00038 12.6346 2Z" fill="var(--color-text-primary)" />
  </svg>
);

const ArrowSecondary = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="18" 
    height="18" 
    viewBox="0 0 18 18" 
    fill="none" 
    aria-hidden="true"
  >
    <path d="M16.6808 0C17.0307 0 17.3662 0.138986 17.6136 0.386383C17.861 0.633779 18 0.969321 18 1.31919V11.8727C18 12.2226 17.861 12.5581 17.6136 12.8055C17.3662 13.0529 17.0307 13.1919 16.6808 13.1919C16.3309 13.1919 15.9954 13.0529 15.748 12.8055C15.5006 12.5581 15.3616 12.2226 15.3616 11.8727V4.50372L2.23565 17.6297C1.98685 17.87 1.65362 18.003 1.30773 17.9999C0.961841 17.9969 0.630971 17.8582 0.386382 17.6136C0.141793 17.369 0.00305554 17.0382 4.9869e-05 16.6923C-0.0029558 16.3464 0.130011 16.0132 0.370313 15.7643L13.4963 2.63838H6.12727C5.7774 2.63838 5.44186 2.4994 5.19446 2.252C4.94706 2.00461 4.80808 1.66906 4.80808 1.31919C4.80808 0.969321 4.94706 0.633779 5.19446 0.386383C5.44186 0.138986 5.7774 0 6.12727 0H16.6808Z" fill="var(--color-primary)" />
  </svg>
);

const Btn = forwardRef(({
  children,
  to,
  href,
  onClick,
  primary = false,
  secondary = false,
  plain = false,
  nav = false,
  textless = false,
  arrow = true,
  className = '',
  disabled,
  ...rest
}, ref) => {
  // Determine variant once
  const variant = primary ? 'primary' : secondary ? 'secondary' : null;

  // Clean className composition
  const baseClasses = [
    !plain && 'btn',
    !plain && variant && `btn-${variant}`,
    className,
  ].filter(Boolean).join(' ');

  const ArrowIcon = variant === 'primary' ? ArrowPrimary : ArrowSecondary;

  // Content rendering logic – clear separation of concerns
  const content = plain ? (
    children
  ) : nav ? (
    <>
      <span className="menu__nav-arrow absolute flex-all" aria-hidden="true">
        <ArrowSecondary />
      </span>
      <span className="menu__nav-text">{children}</span>
    </>
  ) : (
    <>
      {!textless && <span className="btn__text relative">{children}</span>}
      {arrow && variant && (
        <span className="btn__arrow" aria-hidden="true">
          <ArrowIcon />
        </span>
      )}
    </>
  );

  const commonProps = {
    className: baseClasses,
    onClick,
    disabled,
    'aria-disabled': disabled ? 'true' : undefined,
    ...rest,
  };

  if (to) {
    return (
      <Link to={to} ref={ref} {...commonProps}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} ref={ref} {...commonProps}>
        {content}
      </a>
    );
  }

  return (
    <button 
      ref={ref} 
      type="button" 
      {...commonProps}
    >
      {content}
    </button>
  );
});

Btn.displayName = 'Btn';

export default Btn;