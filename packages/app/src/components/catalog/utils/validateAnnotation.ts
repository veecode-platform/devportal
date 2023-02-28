
export const validateAnnotation : (value: string) => boolean = (value) => {
    const ANNOTATIONS = localStorage.getItem('annotations');
    const data = ANNOTATIONS !== null && JSON.parse(ANNOTATIONS) as string;
    if (data.hasOwnProperty(value))  return true;
    return false;
  }