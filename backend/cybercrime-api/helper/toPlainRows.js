// Convert Oracle rows to plain JSON-serializable objects
function toPlainRows(rows) {
  return (rows || []).map((row) => {
    const plain = {};
    for (const [key, value] of Object.entries(row || {})) {
      if (value instanceof Date) {
        plain[key] = value.toISOString();
      } else if (value && typeof value === 'object') {
        // Fallback to string if serialization fails
        try {
          plain[key] = JSON.parse(JSON.stringify(value));
        } catch (err) {
          plain[key] = value.toString();
        }
      } else {
        plain[key] = value;
      }
    }
    return plain;
  });
}

module.exports = { toPlainRows };