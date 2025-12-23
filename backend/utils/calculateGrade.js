export const calculateGrade = (marks) => {
  const total = marks.reduce((a, b) => a + b, 0);
  const average = Math.round(total / marks.length);

  let grade = 'F';
  if (average >= 90) grade = 'A+';
  else if (average >= 80) grade = 'A';
  else if (average >= 70) grade = 'B+';
  else if (average >= 60) grade = 'B';
  else if (average >= 50) grade = 'C';
  else if (average >= 40) grade = 'D';

  return { total, average, grade };
};
