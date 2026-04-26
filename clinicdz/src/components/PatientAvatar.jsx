export default function PatientAvatar({ sexe, size = 'md' }) {
  const isMale = sexe === 'Homme';
  const sizeClass = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const containerClass = `${sizeClass} rounded-full flex items-center justify-center ${
    isMale ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'
  }`;

  return (
    <div className={containerClass}>
      <svg
        className={iconSize}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    </div>
  );
}
