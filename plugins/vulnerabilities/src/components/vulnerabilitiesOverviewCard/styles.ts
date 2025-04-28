import { makeStyles } from "@material-ui/core";

export const useVulnerabilitiesStyles = makeStyles(theme=> ({
    root:{
        backgroundColor: theme.palette.background.paper,
       padding: '1rem',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        gap: '.8rem',
        flexDirection: 'column'
    },
    vulnerabilitiesChips:{
        width: '85%',
        margin: 'left',
        display: 'flex',
        alignItems: 'cemter',
        justifyContent: 'center',
        gap: '.5rem',
    },
    footer:{
        alignSelf:"flex-end"
    },
    buttonStyle:{
        background: "transparent",
        outline: "none",
        border: "none",
        cursor: 'pointer',
        color: theme.palette.text.primary
    }
}))