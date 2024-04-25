import { IconButton,makeStyles } from '@material-ui/core'
import React, { memo } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import InfoIcon from '@material-ui/icons/Info';
import { Link } from '@backstage/core-components';

export type DismissableBannerPropsType = {
    handleShowAlert: ()=>void,
    show: boolean
}

const useStyle = makeStyles({
   banner:{
    background: '#60a5fa40',
    width: '100%',
    position: 'fixed',
    padding: '.6rem 1rem',
    ['z-index']: '999999',
   },
   bannerContent: {
    width:'88%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
   },
   messageBox:{
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
   }
   
})
const DismissableBanner : React.FC<DismissableBannerPropsType> = ({handleShowAlert, show}) => {

  const { banner,bannerContent, messageBox } = useStyle();

  if(!show) return null

  return (
     <div className={banner}>
         <div className={bannerContent}>
         <div className={messageBox}>
            <InfoIcon/> 
            <p>This instance is not supported, <Link to="/support">click to subscribe</Link></p> 
        </div>
        <IconButton size="small" aria-label="close" color="inherit" onClick={handleShowAlert}>
            <CloseIcon fontSize="small" />
        </IconButton>
         </div>
     </div>
  )
}

export default memo(DismissableBanner)