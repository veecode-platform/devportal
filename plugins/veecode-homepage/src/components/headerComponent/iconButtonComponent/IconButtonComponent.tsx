import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Link } from 'react-router-dom';
import { ReactElement, MouseEvent } from 'react';

interface IconButtonProps {
  title: string;
  label: string;
  color: 'warning' | 'error' | 'inherit';
  handleClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  link?: string;
  children: ReactElement;
}

export const IconButtonComponent: React.FC<IconButtonProps> = ({
  title,
  label,
  color,
  handleClick,
  link,
  children,
}) => {
  const button = (
    <IconButton
      size="small"
      aria-label={label}
      color={color}
      aria-controls={`${label}-menu`}
      aria-haspopup="true"
      sx={{
        width: '42px',
        height: '42px',
        borderRadius: '50%',
      }}
      onClick={handleClick}
    >
      {children}
    </IconButton>
  );

  return (
    <Tooltip title={title}>
      {link ? <Link to={link}>{button}</Link> : button}
    </Tooltip>
  );
};
