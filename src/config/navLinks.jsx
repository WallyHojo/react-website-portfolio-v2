export const NAV_LINKS = [
  { to: '/',        label: 'Home',    exact: true,  mobileLabel: false },
  { to: '/skills',  label: 'Skills',  exact: true,  mobileLabel: true },
  { to: '/work',    label: 'Work',    exact: false, mobileLabel: true }, // stays active on /work/project
  { to: '/about',   label: 'About',   exact: true,  mobileLabel: true },
  { to: '/contact', label: 'Contact', exact: true,  mobileLabel: false },
  { to: '/resume',  label: 'Resume',  exact: true,  mobileLabel: true },
];