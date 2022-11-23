import React, {useState} from 'react';
import { Progress} from '@backstage/core-components';
import { Select, MenuItem, ListItemText} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import useAsync from 'react-use/lib/useAsync';
import {useStyles} from "./PartnerListThemeUtils";

type Partner = {
  id: string;
  name: string;
}

type PartnerListProps = {
  partners: Partner[];
}

const PartnersList = ({partners}:PartnerListProps) =>{

  const classes = useStyles();
  const [selected, setSelected] = useState<typeof partners | []>([]);
  const isAllSelected = partners.length > 0 && selected.length === partners.length;

  const handleChange = (e: any) => {
    const value = e.target.value;
    if (value[value.length - 1] === "clear") {
      setSelected([])
      return;
    }
    setSelected(value);
  };

  return (
    <Select
    fullWidth
    variant="outlined"
    value={selected}
    renderValue={(selected:any) => selected.join(", ")}
    displayEmpty
    multiple
    onChange={handleChange}
    >
      <MenuItem
          value="clear"
          classes={{
            root: isAllSelected ? classes.selectedAll : ""
          }}
        >
          <ListItemText
            classes={{ primary: classes.selectAllText }}
            primary="Clear"
          />
        </MenuItem>
      {partners.map((p)=>{
        return ( 
          <MenuItem value={p.name} key={p.id}>
            {<ListItemText primary={p.name}/>}
          </MenuItem> 
        )
      })}     
  </Select>
)}

export const PartnerListComponent = () => {
    const { value, loading, error } = useAsync(async (): Promise<Partner[]> => {
      const response = await fetch('http://localhost:7007/api/application');
      const data = await response.json();
      return data.applications;
    }, []);
  
    if (loading) {
      return <Progress />;
    } else if (error) {
      return <Alert severity="error">{error.message}</Alert>;
    }
  
    return <PartnersList partners={value || []} />;
  };