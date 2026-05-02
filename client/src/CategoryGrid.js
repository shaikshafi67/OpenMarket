import React from 'react';
import { useLang } from './LanguageContext';
import CATEGORY_ICONS from './CategoryIcons';

const categories = [
  { name: 'Cars',                         bg: 'linear-gradient(135deg,#fde8e8,#ffd4d4)' },
  { name: 'Bikes',                         bg: 'linear-gradient(135deg,#e8f0fe,#cfe0ff)' },
  { name: 'Properties',                    bg: 'linear-gradient(135deg,#e8f5e9,#c8eacb)' },
  { name: 'Electronics & Appliances',      bg: 'linear-gradient(135deg,#f3e5f5,#e1bee7)' },
  { name: 'Mobiles',                       bg: 'linear-gradient(135deg,#e3f2fd,#bbdefb)' },
  { name: 'Commercial Vehicles & Spares',  bg: 'linear-gradient(135deg,#fff8e1,#ffecb3)' },
  { name: 'Jobs',                          bg: 'linear-gradient(135deg,#fbe9e7,#ffccbc)' },
  { name: 'Furniture',                     bg: 'linear-gradient(135deg,#f9fbe7,#f0f4c3)' },
  { name: 'Fashion',                       bg: 'linear-gradient(135deg,#fce4ec,#f8bbd0)' },
  { name: 'Pets',                          bg: 'linear-gradient(135deg,#e0f2f1,#b2dfdb)' },
  { name: 'Books, Sports & Hobbies',       bg: 'linear-gradient(135deg,#fff3e0,#ffe0b2)' },
  { name: 'Services',                      bg: 'linear-gradient(135deg,#f3e5f5,#e1bee7)' },
];

function CategoryGrid({ onCategorySelect }) {
  const { tCat } = useLang();
  return (
    <div style={wrapper}>
      <div style={grid}>
        {categories.map((cat) => {
          const IconComponent = CATEGORY_ICONS[cat.name];
          return (
            <div
              key={cat.name}
              className="category-card"
              style={card}
              onClick={() => onCategorySelect(cat.name)}
            >
              <div style={{ ...imgBox, background: cat.bg }}>
                {IconComponent && <IconComponent size={54} />}
              </div>
              <p style={label}>{tCat(cat.name)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const wrapper = { padding: '30px 0 10px' };
const grid = { display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '14px' };
const card = {
  backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0,47,52,0.08)', display: 'flex',
  flexDirection: 'column', alignItems: 'center', cursor: 'pointer',
};
const imgBox = {
  width: '100%', height: '90px',
  display: 'flex', justifyContent: 'center', alignItems: 'center',
};
const label = {
  margin: '0', padding: '8px 6px 12px',
  fontSize: '12px', fontWeight: '700', color: '#002f34',
  textAlign: 'center', lineHeight: 1.3,
};

export default CategoryGrid;
