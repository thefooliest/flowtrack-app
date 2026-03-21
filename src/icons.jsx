const paths = {
  play: <polygon points="5,3 19,12 5,21" fill="currentColor" />,
  pause: (
    <>
      <rect x="4" y="3" width="6" height="18" rx="1" fill="currentColor" />
      <rect x="14" y="3" width="6" height="18" rx="1" fill="currentColor" />
    </>
  ),
  stop: <rect x="4" y="4" width="16" height="16" rx="2" fill="currentColor" />,
  plus: (
    <>
      <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  back: (
    <polyline points="15,18 9,12 15,6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  ),
  trash: (
    <>
      <polyline points="3,6 5,6 21,6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6M8,6V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  download: (
    <>
      <path d="M21,15v4a2,2,0,0,1-2,2H5a2,2,0,0,1-2-2V15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <polyline points="7,10 12,15 17,10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  subtask: (
    <>
      <path d="M6,3v12a3,3,0,0,0,3,3h6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="13,14 18,18 13,22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="translate(0,-2)" />
    </>
  ),
  alert: (
    <>
      <path d="M10.29,3.86L1.82,18a2,2,0,0,0,1.71,3H20.47a2,2,0,0,0,1.71-3L13.71,3.86A2,2,0,0,0,10.29,3.86Z" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="currentColor" />
    </>
  ),
  check: (
    <polyline points="20,6 9,17 4,12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  ),
  bulb: (
    <path d="M9,18h6M10,22h4M12,2a7,7,0,0,0-4,12.7V17a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V14.7A7,7,0,0,0,12,2Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  ),
  link: (
    <>
      <path d="M10,13a5,5,0,0,0,7.54.54l3-3a5,5,0,0,0-7.07-7.07l-1.72,1.71" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M14,11a5,5,0,0,0-7.54-.54l-3,3a5,5,0,0,0,7.07,7.07l1.71-1.71" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
};

export default function Icon({ name, size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      {paths[name]}
    </svg>
  );
}
