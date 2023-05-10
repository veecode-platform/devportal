import React, {useState} from 'react';
import { Table, TableColumn, Progress } from '@backstage/core-components';
import Alert from '@material-ui/lab/Alert';
import useAsync from 'react-use/lib/useAsync';
import AxiosInstance from '../../../../api/Api';
import { useAppConfig } from '../../../../hooks/useAppConfig';
import { IService } from '../../../services/utils/interfaces';
import {IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import { CopyBlock, vs2015 } from "react-code-blocks";

type dialogProps = {
    show: boolean;
    handleClose: any;
    route:string | undefined;
  }
  
  const ConfirmDialog = ({show, handleClose, route}: dialogProps) =>{
    const option1 = 
`curl -i -X POST '${route}oauth2/token' \\
--header 'Content-Type: application/x-www-form-urlencoded' \\ 
--data-urlencode 'client_id=XXXX' \\
--data-urlencode 'client_secret=XXXX' \\
--data-urlencode 'grant_type=client_credentials'`

const option2 = 
`curl -i -X POST '${route}oauth2/token' \\
--header 'Content-Type: application/json' \\
--data-raw '{ "client_id": "XXXXX", "client_secret": "XXXX", "grant_type": "client_credentials" }'
`

    return (
      <Dialog
      fullWidth={true}
      maxWidth={"md"}
      open={show}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Follow these steps to generate an Oauth2 token"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <CopyBlock
                language={"bash"}
                showLineNumbers={false}
                theme={vs2015}
                wrapLongLines={false}
                text={option1}
            />
            <div style={{marginTop:"8px", marginBottom:"8px"}}>OR</div>
            <CopyBlock
                language={"bash"}
                showLineNumbers={false}
                theme={vs2015}
                wrapLongLines={false}
                text={option2}
            />

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
    </Dialog>
  )}
  

type DenseTableProps = {
  services: IService[],
};

 const DenseTable = ({services} : DenseTableProps) => {

    const [showDialog, setShowDialog] = useState(false)
    const [route, setRoute] = useState("")

    const handleShowDialog = () =>{
        setShowDialog(true)
    }
    const handleCloseDialog = () =>{
        setShowDialog(false)
    }
  
  const columns: TableColumn[] = [
    { title: 'Name', field: 'name',width:'1fr' },
    { title: 'Kong', field: 'kong',width:'1fr' },
    { title: 'Credentials', field: 'credentials',width:'1fr'},
  ];

  const data = services.map(service => {
    return {
      name: service.name,
      kong: service.kongServiceName,
      credentials: service.securityType === "oauth2" ? <IconButton onClick={()=>{
        setRoute(service.route || "https://example.service.com")
        handleShowDialog()
    }}><InfoIcon/></IconButton> : null
    };
  });

  return (
    <>
      <Table
        title={`All services (${services.length})`}
        options={{ search: true, paging: true }}
        columns={columns}
        data={data}
        style={{ width: '100%', border: 'none' }}
      />
      <ConfirmDialog show={showDialog} handleClose={handleCloseDialog} route={route}/>
    </>
  );
};

export const FetchServicesFromApplicationListComponent = ({ applicationId }: { applicationId: string }) => {
  const BackendBaseUrl = useAppConfig().BackendBaseUrl;
  const { value, loading, error } = useAsync(async (): Promise<IService[]> => {
    const response =  await AxiosInstance.get(`${BackendBaseUrl}/applications/${applicationId}/services`)
    return response.data.services;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return <DenseTable services={value || []} />;
};


