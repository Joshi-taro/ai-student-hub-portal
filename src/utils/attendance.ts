
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'Present':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Absent':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getPerformanceColor = (percentage: number, threshold = 75) => {
  if (percentage >= 90) {
    return "text-green-600";
  } else if (percentage >= threshold) {
    return "text-blue-600";
  } else {
    return "text-red-600";
  }
};

export const getProgressColor = (percentage: number, threshold = 75) => {
  if (percentage >= 90) {
    return "bg-green-500";
  } else if (percentage >= threshold) {
    return "bg-blue-500";
  } else {
    return "bg-red-500";
  }
};

export const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
