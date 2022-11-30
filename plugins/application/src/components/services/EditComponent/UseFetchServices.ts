import useAsync from 'react-use/lib/useAsync';

type Service = {
    id: string; 
    name: string; 
    description: string;
    redirectUrl: string;
    kongServiceName: string;
    kongServiceId: string; 
    createdAt: string; 
    updatedAt: string; 
};


function UseFetchService(id:string) {

    const { value, loading, error } = useAsync(async (): Promise<Service> => {
      const response = await fetch(`http://localhost:7007/api/application/service/${id}`);
      const data = await response.json();
      //console.log(data)
      return data.services;
    }, []);
  
    return {value, loading, error};
}

export default UseFetchService;