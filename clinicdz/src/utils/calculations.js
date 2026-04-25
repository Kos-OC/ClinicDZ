export const calculateAge = (dateNaissance) => {
  if (!dateNaissance) return '';
  
  // Support both YYYY-MM-DD (standard) and DD-MM-YYYY (French display)
  let year, month, day;
  const parts = dateNaissance.split(/[-/]/).map(Number);
  
  if (parts[0] > 1000) {
    // YYYY-MM-DD
    [year, month, day] = parts;
  } else {
    // DD-MM-YYYY
    [day, month, year] = parts;
  }

  if (!year || !month || !day) return '';

  const today = new Date();
  const tYear = today.getFullYear();
  const tMonth = today.getMonth() + 1; // 1-12
  const tDay = today.getDate();

  let age = tYear - year;
  if (tMonth < month || (tMonth === month && tDay < day)) {
    age--;
  }
  return age >= 0 ? age : 0;
};

export const calculateBirthYear = (age) => {
  if (age === null || age === undefined || age === '') return '';
  const today = new Date();
  const birthYear = today.getFullYear() - Number(age);
  return `01-01-${birthYear}`; // Default to Jan 1st of that year
};

export const formatFrenchDate = (dateStr) => {
  if (!dateStr) return '';
  const parts = dateStr.split(/[-/]/);
  if (parts[0].length === 4) {
    // YYYY-MM-DD -> DD-MM-YYYY
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateStr;
};
