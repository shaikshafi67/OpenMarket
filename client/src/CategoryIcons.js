import React from 'react';

const s = (size = 48) => ({ width: size, height: size });

export const CarIcon = ({ size = 48 }) => (
  <svg style={s(size)} viewBox="0 0 64 64" fill="none">
    <path d="M54 30H10l4-12h36l4 12z" fill="#e53935"/>
    <rect x="8" y="28" width="48" height="16" rx="4" fill="#ef5350"/>
    <path d="M16 22h32l3 8H13l3-8z" fill="#c62828"/>
    <rect x="18" y="22" width="10" height="7" rx="1.5" fill="#90caf9"/>
    <rect x="36" y="22" width="10" height="7" rx="1.5" fill="#90caf9"/>
    <circle cx="18" cy="44" r="6" fill="#263238"/>
    <circle cx="18" cy="44" r="3" fill="#78909c"/>
    <circle cx="46" cy="44" r="6" fill="#263238"/>
    <circle cx="46" cy="44" r="3" fill="#78909c"/>
    <rect x="22" y="32" width="20" height="4" rx="2" fill="#ffcdd2"/>
    <circle cx="10" cy="34" r="2" fill="#fff9c4"/>
    <circle cx="54" cy="34" r="2" fill="#ffccbc"/>
  </svg>
);

export const BikeIcon = ({ size = 48 }) => (
  <svg style={s(size)} viewBox="0 0 64 64" fill="none">
    <circle cx="14" cy="44" r="10" fill="#263238"/>
    <circle cx="14" cy="44" r="6" fill="#78909c"/>
    <circle cx="14" cy="44" r="2" fill="#263238"/>
    <circle cx="50" cy="44" r="10" fill="#263238"/>
    <circle cx="50" cy="44" r="6" fill="#78909c"/>
    <circle cx="50" cy="44" r="2" fill="#263238"/>
    <path d="M14 44 L32 20 L50 44" stroke="#e53935" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M28 20h10l4 8H32z" fill="#ef5350"/>
    <path d="M32 20 L36 10 L44 14" stroke="#bdbdbd" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="36" cy="10" r="3" fill="#757575"/>
  </svg>
);

export const PropertyIcon = ({ size = 48 }) => (
  <svg style={s(size)} viewBox="0 0 64 64" fill="none">
    <rect x="12" y="28" width="40" height="28" rx="2" fill="#78909c"/>
    <path d="M8 30 L32 10 L56 30" fill="#546e7a"/>
    <rect x="22" y="38" width="10" height="18" rx="1" fill="#90a4ae"/>
    <rect x="38" y="36" width="9" height="9" rx="1" fill="#90caf9"/>
    <rect x="16" y="36" width="9" height="9" rx="1" fill="#90caf9"/>
    <rect x="29" y="22" width="6" height="6" rx="1" fill="#90caf9"/>
  </svg>
);

export const ElectronicsIcon = ({ size = 48 }) => (
  <svg style={s(size)} viewBox="0 0 64 64" fill="none">
    <rect x="8" y="10" width="48" height="34" rx="3" fill="#37474f"/>
    <rect x="12" y="14" width="40" height="26" rx="2" fill="#29b6f6"/>
    <rect x="22" y="44" width="20" height="4" fill="#546e7a"/>
    <rect x="16" y="48" width="32" height="3" rx="1.5" fill="#455a64"/>
    <path d="M20 27 L28 20 L36 27 L44 20" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const MobileIcon = ({ size = 48 }) => (
  <svg style={s(size)} viewBox="0 0 64 64" fill="none">
    <rect x="18" y="6" width="28" height="52" rx="5" fill="#1565c0"/>
    <rect x="21" y="12" width="22" height="36" rx="2" fill="#90caf9"/>
    <circle cx="32" cy="52" r="3" fill="#42a5f5"/>
    <rect x="28" y="8" width="8" height="2" rx="1" fill="#90caf9"/>
    <rect x="24" y="20" width="16" height="2" rx="1" fill="#1565c0" opacity="0.3"/>
    <rect x="24" y="25" width="10" height="2" rx="1" fill="#1565c0" opacity="0.3"/>
  </svg>
);

export const CommercialIcon = ({ size = 48 }) => (
  <svg style={s(size)} viewBox="0 0 64 64" fill="none">
    <rect x="4" y="24" width="36" height="24" rx="3" fill="#f9a825"/>
    <path d="M40 36h14l-4-16H40v16z" fill="#fbc02d"/>
    <rect x="6" y="28" width="16" height="10" rx="1.5" fill="#90caf9"/>
    <circle cx="14" cy="48" r="6" fill="#263238"/>
    <circle cx="14" cy="48" r="3" fill="#78909c"/>
    <circle cx="50" cy="48" r="6" fill="#263238"/>
    <circle cx="50" cy="48" r="3" fill="#78909c"/>
    <rect x="4" y="40" width="54" height="4" rx="1" fill="#e65100" opacity="0.3"/>
  </svg>
);

export const JobsIcon = ({ size = 48 }) => (
  <svg style={s(size)} viewBox="0 0 64 64" fill="none">
    <rect x="10" y="26" width="44" height="30" rx="3" fill="#6d4c41"/>
    <rect x="14" y="30" width="36" height="22" rx="2" fill="#8d6e63"/>
    <path d="M22 26v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4" stroke="#6d4c41" strokeWidth="3" fill="none"/>
    <rect x="28" y="38" width="8" height="6" rx="1" fill="#6d4c41"/>
    <rect x="10" y="36" width="44" height="6" rx="1" fill="#795548"/>
  </svg>
);

export const FurnitureIcon = ({ size = 48 }) => (
  <svg style={s(size)} viewBox="0 0 64 64" fill="none">
    <rect x="8" y="28" width="48" height="18" rx="4" fill="#f9a825"/>
    <rect x="12" y="22" width="40" height="10" rx="3" fill="#ffb300"/>
    <rect x="8" y="44" width="8" height="10" rx="2" fill="#e65100"/>
    <rect x="48" y="44" width="8" height="10" rx="2" fill="#e65100"/>
    <rect x="14" y="28" width="36" height="10" rx="2" fill="#ffe082"/>
    <circle cx="50" cy="18" r="7" fill="#fff9c4"/>
    <rect x="48" y="14" width="4" height="10" rx="1" fill="#ffcc02"/>
    <path d="M44 18 L56 18" stroke="#fbc02d" strokeWidth="2"/>
  </svg>
);

export const FashionIcon = ({ size = 48 }) => (
  <svg style={s(size)} viewBox="0 0 64 64" fill="none">
    <path d="M22 6 L16 18 H6 L16 30 H48 L58 18 H48 L42 6 H22z" fill="#e91e63"/>
    <path d="M22 6 Q32 14 42 6" fill="#c2185b"/>
    <rect x="16" y="28" width="32" height="26" rx="2" fill="#f06292"/>
    <path d="M16 38 Q32 44 48 38" stroke="#e91e63" strokeWidth="2" fill="none"/>
  </svg>
);

export const PetsIcon = ({ size = 48 }) => (
  <svg style={s(size)} viewBox="0 0 64 64" fill="none">
    <ellipse cx="32" cy="38" rx="16" ry="14" fill="#26a69a"/>
    <ellipse cx="14" cy="22" rx="6" ry="8" rx2="6" fill="#26a69a"/>
    <ellipse cx="50" cy="22" rx="6" ry="8" fill="#26a69a"/>
    <ellipse cx="14" cy="22" rx="3" ry="5" fill="#80cbc4"/>
    <ellipse cx="50" cy="22" rx="3" ry="5" fill="#80cbc4"/>
    <circle cx="24" cy="32" r="4" fill="#00796b"/>
    <circle cx="40" cy="32" r="4" fill="#00796b"/>
    <circle cx="32" cy="42" r="4" fill="#00796b"/>
    <circle cx="24" cy="32" r="2" fill="#4db6ac"/>
    <circle cx="40" cy="32" r="2" fill="#4db6ac"/>
    <circle cx="32" cy="42" r="2" fill="#4db6ac"/>
  </svg>
);

export const BooksIcon = ({ size = 48 }) => (
  <svg style={s(size)} viewBox="0 0 64 64" fill="none">
    <rect x="8" y="14" width="20" height="36" rx="2" fill="#ef6c00"/>
    <rect x="10" y="16" width="16" height="32" rx="1" fill="#ffe0b2"/>
    <rect x="30" y="10" width="20" height="40" rx="2" fill="#1565c0"/>
    <rect x="32" y="12" width="16" height="36" rx="1" fill="#bbdefb"/>
    <rect x="8" y="14" width="2" height="36" fill="#e65100"/>
    <rect x="30" y="10" width="2" height="40" fill="#0d47a1"/>
    <path d="M13 26 L23 26 M13 30 L20 30 M13 34 L23 34" stroke="#ef6c00" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M35 22 L45 22 M35 26 L42 26 M35 30 L45 30" stroke="#1565c0" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const ServicesIcon = ({ size = 48 }) => (
  <svg style={s(size)} viewBox="0 0 64 64" fill="none">
    <path d="M38 10 a4 4 0 0 1 0 8 L14 42 a4 4 0 0 1-8-8 L38 10z" fill="#757575"/>
    <circle cx="40" cy="14" r="6" fill="#9e9e9e"/>
    <circle cx="10" cy="46" r="6" fill="#9e9e9e"/>
    <path d="M44 30 a4 4 0 0 1 0 8 L40 42 a6 6 0 0 0 8 8 L56 40 a4 4 0 0 0-4-4z" fill="#bdbdbd"/>
    <circle cx="46" cy="34" r="3" fill="#757575"/>
  </svg>
);

export const CATEGORY_ICONS = {
  'Cars':                          CarIcon,
  'Bikes':                         BikeIcon,
  'Properties':                    PropertyIcon,
  'Electronics & Appliances':      ElectronicsIcon,
  'Mobiles':                       MobileIcon,
  'Commercial Vehicles & Spares':  CommercialIcon,
  'Jobs':                          JobsIcon,
  'Furniture':                     FurnitureIcon,
  'Fashion':                       FashionIcon,
  'Pets':                          PetsIcon,
  'Books, Sports & Hobbies':       BooksIcon,
  'Services':                      ServicesIcon,
};

export default CATEGORY_ICONS;
