// Convert Oracle rows to plain JSON-serializable objects
function toPlainRows(rows) {
  return (rows || []).map((row) => {
    const plain = {};
    for (const [key, value] of Object.entries(row || {})) {
      if (value instanceof Date) {
        plain[key] = value.toISOString();
      } else if (value && typeof value === 'object') {
        // Check if it's a Lob object
        if (value.constructor && value.constructor.name === 'Lob') {
          // If it's a Lob object, it should have already been fetched as string
          // This shouldn't happen with fetchAsString config, but just in case
          plain[key] = '[Lob object not converted]';
        } else {
          // Fallback to string if serialization fails
          try {
            plain[key] = JSON.parse(JSON.stringify(value));
          } catch (err) {
            plain[key] = String(value);
          }
        }
      } else {
        plain[key] = value;
      }
    }
    return plain;
  });
}

module.exports = { toPlainRows };