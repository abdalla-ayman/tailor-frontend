import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';


const Navbar = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
                    عادل ود السيال
                </Typography>
                <Link to="/profile" style={{ textDecoration: 'none' }}>
                    <IconButton
                        edge="start"
                        color="info"
                        aria-label="profile"
                        sx={{ ml: 'auto', color: 'white' }}
                    >
                        <AccountCircle />
                    </IconButton>
                </Link>
            </Toolbar>
        </AppBar>

    );
};

export default Navbar;
