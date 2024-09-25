function formatJson(input: string): string {
  try {
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed, null, 2);
  } catch (err) {
    return input;
  }
}

export default formatJson;
