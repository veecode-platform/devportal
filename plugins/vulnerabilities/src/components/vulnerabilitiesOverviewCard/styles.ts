import { makeStyles } from "@material-ui/core";

export const useVulnerabilitiesStyles = makeStyles(theme=> ({
    root:{
      padding: '1rem',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      flexDirection: 'column'
    },
    vulnerabilitiesChips:{
        width: 'auto',
        display: 'flex',
        flexWrap: "wrap",
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '1rem',
        padding: '1rem 0'
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