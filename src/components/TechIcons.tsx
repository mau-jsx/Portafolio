import React from 'react';

interface TechIconProps {
  className?: string;
  size?: number;
}

export const ReactIcon: React.FC<TechIconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="-11.5 -10.23174 23 20.46348" fill="none" className={className}>
    <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
    <g stroke="#61DAFB" strokeWidth="1" fill="none">
      <ellipse rx="11" ry="4.2" />
      <ellipse rx="11" ry="4.2" transform="rotate(60)" />
      <ellipse rx="11" ry="4.2" transform="rotate(120)" />
    </g>
  </svg>
);

export const NextjsIcon: React.FC<TechIconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 180 180" fill="none" className={className}>
    <mask height="180" id="mask0" maskUnits="userSpaceOnUse" width="180" x="0" y="0" style={{ maskType: 'alpha' }}>
      <circle cx="90" cy="90" fill="black" r="90" />
    </mask>
    <g mask="url(#mask0)">
      <circle cx="90" cy="90" data-framer-name="base" fill="black" r="90" stroke="white" strokeWidth="6" />
      <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="url(#paint0_linear)" />
      <rect fill="url(#paint1_linear)" height="72" width="12" x="115" y="54" />
    </g>
    <defs>
      <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear" x1="109" x2="144.5" y1="116.5" y2="160.5">
        <stop stopColor="white" />
        <stop offset="1" stopColor="white" stopOpacity="0" />
      </linearGradient>
      <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear" x1="121" x2="120.799" y1="54" y2="106.875">
        <stop stopColor="white" />
        <stop offset="1" stopColor="white" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

export const AngularIcon: React.FC<TechIconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 250 250" fill="none" className={className}>
    <polygon fill="#DD0031" points="125,30 125,30 125,30 31.9,63.2 46.1,186.3 125,230 125,230 125,230 203.9,186.3 218.1,63.2" />
    <polygon fill="#C3002F" points="125,30 125,52.2 125,52.1 125,153.4 125,153.4 125,230 125,230 203.9,186.3 218.1,63.2" />
    <path d="M125,52.1L66.8,182.6H88.5L100.2,153.4H125H149.8L161.5,182.6H183.2L125,52.1ZM125,133.4H110.1L125,97.4L139.9,133.4H125Z" fill="#FFFFFF" />
  </svg>
);

export const FlutterIcon: React.FC<TechIconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 166 202" fill="none" className={className}>
    <path d="M100.1 0L0 100.1L30.9 131L162 0H100.1Z" fill="#47C5FB" />
    <path d="M100.1 100.1L49.1 151.1L79.9 182L162 100.1H100.1Z" fill="#47C5FB" />
    <path d="M49.1 151.1L80 182L100.1 161.9L80 141.8L49.1 151.1Z" fill="#00569E" />
    <path d="M79.9 182L100.1 202.1H162L100.1 140.2L79.9 182Z" fill="#00B5F8" />
  </svg>
);

export const TypeScriptIcon: React.FC<TechIconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
    <rect width="128" height="128" rx="20" fill="#3178C6" />
    <path d="M76 96.5c-4.4.8-8.9 1.2-13.4 1.2-13.8 0-21.2-7.1-21.2-19.9V45.2H27.5v-10h13.9V18.8L53.7 15v20.2h18.8v10H53.7v30.4c0 7.3 3.6 11.2 10.9 11.2 3.8 0 7.8-.5 11.4-1.3v11zM100.5 73.8c-2.4 0-4.8.4-6.8 1.1-2 .7-3.8 1.8-5.1 3.2v-2.3H77.1V128h11.5V99.5c1.4 1.5 3.1 2.6 5.1 3.4 2 .7 4.4 1.1 6.8 1.1 6.5 0 11.7-2.6 15.5-7.8 3.8-5.2 5.8-12.4 5.8-21.3s-2-16-5.8-21.2c-3.8-5.3-9-7.9-15.5-7.9zm-.9 40.5c-3.7 0-6.6-1.4-8.8-4.2s-3.3-6.8-3.3-12 1.1-9.2 3.3-12 5.1-4.2 8.8-4.2c3.6 0 6.5 1.4 8.7 4.2s3.3 6.8 3.3 12-1.1 9.2-3.3 12-5.1 4.2-8.7 4.2z" fill="#FFF" transform="scale(0.85) translate(10, 10)" />
  </svg>
);

export const TailwindIcon: React.FC<TechIconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.335 6.182 14.974 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.335 13.382 8.974 12 6.001 12z" fill="#38BDF8" />
  </svg>
);

export const NodejsIcon: React.FC<TechIconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
    <path d="M16 2L3 9.5V24.5L16 32L29 24.5V9.5L16 2Z" fill="#339933" />
    <path d="M16 5.5L25.5 11V21L16 26.5L6.5 21V11L16 5.5Z" fill="#66CC33" />
    <path d="M16 11L21.5 14V20L16 23L10.5 20V14L16 11Z" fill="#FFFFFF" />
  </svg>
);

export const NestjsIcon: React.FC<TechIconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 256 256" fill="none" className={className}>
    <path d="M228.6 37.3c-23.7-18.4-56.7-16-79.6 4.7l-45.7 41.3c-7.9 7.2-19.8 8.1-28.7 2.3L61.8 77c-7.9-5.1-18.4-4-25 2.6L16.2 99.8c-6.8 6.9-7.3 17.7-1.1 25.1L86.6 220c7.8 9.3 21.6 10.6 31 3l111.4-89.9c25.4-20.5 32.2-57.1 15.6-85.3l-16-10.5z" fill="#E0234E" />
  </svg>
);

export const JavaIcon: React.FC<TechIconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M8.85 17.84c0 .02.05.04.08.06 1.77.72 3.65.65 5.52.27 1.04-.21 2.05-.59 3.01-1.07.1-.05.15-.17.11-.27-.05-.11-.18-.15-.28-.1-1.46.73-3.08 1.06-4.71.99-1.25-.05-2.49-.38-3.61-.98-.09-.05-.2-.01-.25.08-.02.04-.03.08-.03.13" fill="#E76F00" />
    <path d="M7.74 19.57c.07.03.15.04.22.02 2.21.6 4.54.51 6.7-.26 1.13-.4 2.22-.97 3.21-1.7.08-.06.1-.18.04-.26-.06-.08-.18-.1-.26-.04-1.39 1.01-2.99 1.63-4.71 1.83-1.63.19-3.28-.05-4.83-.71-.1-.04-.21.01-.25.11-.04.1.01.21.11.25" fill="#E76F00" />
    <path d="M14.54 13.06c.92-.32 1.72-.88 2.32-1.62.6-.74.92-1.67.92-2.62 0-.25-.02-.5-.07-.75-.02-.09-.11-.16-.21-.14-.09.02-.16.11-.14.21.04.22.06.45.06.68 0 .84-.28 1.65-.8 2.31s-1.22 1.13-2.03 1.41c-.1.03-.15.14-.12.24.03.09.12.15.21.15.02 0 .04 0 .06-.01" fill="#5382A1" />
    <path d="M12.44 14.89c1.69-.14 3.3-.84 4.57-1.99 1.28-1.15 2.1-2.7 2.33-4.41.02-.12-.06-.23-.18-.25-.12-.02-.23.06-.25.18-.21 1.58-.97 3.01-2.15 4.07s-2.66 1.71-4.22 1.84c-.12.01-.21.12-.2.24.01.12.11.21.23.21" fill="#5382A1" />
  </svg>
);

export const SpringBootIcon: React.FC<TechIconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 256 256" fill="none" className={className}>
    <path d="M128 0C57.3 0 0 57.3 0 128s57.3 128 128 128 128-57.3 128-128S198.7 0 128 0zm68.8 178.6c-4.2 8.7-10.7 15.6-19.1 20.2-12.7 7-28 8-41.5 2.8l16.1-27.9c4.9 1.7 10.3 1.3 14.8-1.2 3.1-1.7 5.5-4.2 7-7.4 1.5-3.2 2-6.7 1.3-10.2s-2.4-6.6-4.9-9.1c-4.2-4.2-10-6.8-16.1-7.2l-18.4-1.2c-12-.8-23.4-6.3-31.4-15.3-7.9-9-11.7-20.9-10.5-32.8 1.2-11.9 7.4-22.7 17-29.8 14.4-10.7 33.3-13.6 50.2-7.8l-15.6 27c-6.1-2-12.8-1.3-18.4 1.9-3.7 2.1-6.4 5.3-7.8 9.3s-1.1 8.3.8 12.1c1.9 3.8 5 6.7 8.8 8.4 3.8 1.7 8.1 2.2 12.3 1.4l18.4-3.5c12-2.3 24.5.8 34.3 8.5 9.7 7.7 15.7 19.3 16.5 31.7.8 12.3-3.8 24.5-12.5 33z" fill="#6DB33F" />
  </svg>
);

export const PythonIcon: React.FC<TechIconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
    <path d="M63.02 0c-15.82 0-29.43 3.65-29.43 17.65v13.53h29.74v4.11H19.56C5.55 35.29 0 44.89 0 63.66c0 19.14 8.78 28.37 23.97 28.37h7.99v-13.2c0-14.86 12.56-27.99 27.87-27.99h29.74v-4.12h-26.6v-2.35h44.15V17.65C107.12 3.65 91.56 0 63.02 0zm-15.54 9.17c3.16 0 5.72 2.56 5.72 5.72s-2.56 5.72-5.72 5.72-5.72-2.56-5.72-5.72 2.56-5.72 5.72-5.72z" fill="#3776AB" />
    <path d="M64.98 128c15.82 0 29.43-3.65 29.43-17.65V96.82H64.67v-4.11h43.77c14.01 0 19.56-9.6 19.56-28.37 0-19.14-8.78-28.37-23.97-28.37h-7.99v13.2c0 14.86-12.56 27.99-27.87 27.99H38.43v4.12h26.6v2.35H20.88v26.72C20.88 124.35 36.44 128 64.98 128zm15.54-9.17c-3.16 0-5.72-2.56-5.72-5.72s2.56-5.72 5.72-5.72 5.72 2.56 5.72 5.72-2.56 5.72-5.72 5.72z" fill="#FFD43B" />
  </svg>
);

export const DockerIcon: React.FC<TechIconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186m-2.93 2.714h2.12a.186.186 0 00.184-.185V9.006a.185.185 0 00-.185-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m0-2.715h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185h-2.119a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m-2.954 2.715h2.119a.186.186 0 00.185-.185V9.006a.185.185 0 00-.185-.186H5.145a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m0-2.715h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.145a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m-2.93 2.715h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.955 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H2.215a.186.186 0 00-.186.185v1.888c0 .102.083.185.186.185m21.688.196c-.328-.184-.814-.294-1.328-.31-.051-.384-.257-.84-.575-1.196a3.528 3.528 0 00-2.023-1.077l-.438-.073-.25.362c-.443.642-.647 1.488-.647 2.378 0 .285.024.571.073.856-.37.195-.875.297-1.464.305H.982a.982.982 0 00-.982.982v.228c.075 2.127.76 4.093 1.956 5.568 1.469 1.815 3.593 2.943 6.064 3.224 4.015.457 8.354-.251 11.956-2.585 2.368-1.536 3.65-3.996 3.905-6.845.034-.386.046-.777.037-1.17-.008-.344-.029-.68-.063-1.006-.02-.19-.047-.373-.082-.551-.157.067-.532.18-.871.209" fill="#2496ED" />
  </svg>
);

export const GsapIcon: React.FC<TechIconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="6" fill="#0AE448" />
    <path d="M16.5 7.5H7.5V16.5H16.5V12H12V10.5H16.5V7.5Z" fill="#000000" />
  </svg>
);

export const ThreejsIcon: React.FC<TechIconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <polygon points="12,2 2,22 22,22" fill="#000000" stroke="#FFFFFF" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="12" cy="14" r="3" fill="#00D26A" />
  </svg>
);

export const N8nIcon: React.FC<TechIconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="6" fill="#EA4B71" />
    <path d="M6 12C6 10.3431 7.34315 9 9 9H15C16.6569 9 18 10.3431 18 12C18 13.6569 16.6569 15 15 15H9C7.34315 15 6 13.6569 6 12Z" stroke="white" strokeWidth="2" />
    <circle cx="9" cy="12" r="1.5" fill="white" />
    <circle cx="15" cy="12" r="1.5" fill="white" />
  </svg>
);

export const OpenAIIcon: React.FC<TechIconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="6" fill="#10A37F" />
    <path d="M12 4V20M4 12H20M6.5 6.5L17.5 17.5M17.5 6.5L6.5 17.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const TerminalIcon: React.FC<TechIconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="6" fill="#1E1E1E" stroke="#333" strokeWidth="1.5" />
    <path d="M7 9L10.5 12L7 15" stroke="#00D26A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 15H17" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const RagIcon: React.FC<TechIconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="6" fill="#7928CA" />
    <circle cx="8" cy="8" r="2" fill="white" />
    <circle cx="16" cy="8" r="2" fill="white" />
    <circle cx="12" cy="16" r="2.5" fill="#00D26A" />
    <path d="M8 8L12 16M16 8L12 16" stroke="white" strokeWidth="1.5" />
  </svg>
);

export const McpIcon: React.FC<TechIconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="6" fill="#FF5500" />
    <path d="M7 12H17M7 7H17M7 17H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <circle cx="16" cy="17" r="1.5" fill="#FFF" />
  </svg>
);

export const GitBrandIcon: React.FC<TechIconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect width={24} height={24} rx={6} fill="#F05032" />
    <path d="M18.5 12.8L12.8 18.5C12.4 18.9 11.6 18.9 11.2 18.5L5.5 12.8C5.1 12.4 5.1 11.6 5.5 11.2L11.2 5.5C11.6 5.1 12.4 5.1 12.8 5.5L18.5 11.2C18.9 11.6 18.9 12.4 18.5 12.8Z" fill="white" />
    <circle cx="12" cy="9" r="1.5" fill="#F05032" />
    <circle cx="12" cy="15" r="1.5" fill="#F05032" />
    <circle cx="9" cy="12" r="1.5" fill="#F05032" />
  </svg>
);

export const RestApiBrandIcon: React.FC<TechIconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect width={24} height={24} rx={6} fill="#0052FF" />
    <path d="M6 9H18M6 12H18M6 15H14" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

