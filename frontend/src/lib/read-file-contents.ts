export default async function readFileContents(file: File): Promise<string> {
  return new Promise((res) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      const fileContents = e.target?.result;
      if (typeof fileContents !== "string") {
        res("");
        return;
      }

      res(fileContents);
    };
  });
}
