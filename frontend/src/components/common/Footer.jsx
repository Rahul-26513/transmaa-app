import React from 'react';

export default function Footer({ dark = false }) {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '18px 16px',
      fontSize: '0.75rem',
      color: dark ? '#64748B' : '#94A3B8',
      borderTop: dark ? '1px solid #1E293B' : '1px solid #E2E8F0'
    }}>
      &copy; {new Date().getFullYear()} Transmaa. All rights reserved. Built by Rahul D. Gowda.
    </footer>
  );
}
