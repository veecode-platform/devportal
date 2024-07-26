import useAsync from 'react-use/lib/useAsync';

export function useSpec() {
  const fetchData = async () => {
    const response = await fetch('https://raw.githubusercontent.com/veecode-platform/devportal/main/package.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const result = await response.json();
    return result.version;
  };

  const { value, loading, error } = useAsync(fetchData, []);

  return {
    lastVersion: value,
    loading,
    error,
  };
}
