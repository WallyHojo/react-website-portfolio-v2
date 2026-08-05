export const NAV_LINKS = [
  { to: '/',        label: 'Home',    exact: true,  mobileLabel: false },
  { to: '/skills',  label: 'Skills',  exact: true,  mobileLabel: true },
  { to: '/work',    label: 'Work',    exact: false, mobileLabel: true }, // stays active on /work/project
  { to: '/about',   label: 'About',   exact: true,  mobileLabel: true },
  { to: '/contact', label: 'Contact', exact: true,  mobileLabel: false },
  /*{ to: 'https://drive.google.com/file/d/1Cmxrbzao3a0DLa7opCwLBvyPLhs7-xvh/view?usp=sharing',  label: 'Resume',  exact: true,  mobileLabel: true },*/
];