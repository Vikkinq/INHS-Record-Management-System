export const formatDate = (timestamp: any) =>
  timestamp
    ? timestamp.toDate
      ? timestamp.toDate().toLocaleDateString()
      : new Date(timestamp).toLocaleDateString()
    : "";
