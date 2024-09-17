export default function debounce<T extends (...p: Parameters<T>) => void>(
  cb: T,
  ms = 150,
) {
  let id: number;

  return (...p: Parameters<T>) => {
    if (id) {
      clearTimeout(id);
    }

    id = window.setTimeout(() => {
      cb(...p);
    }, ms);
  };
}
