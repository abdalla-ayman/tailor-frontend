import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <AppBar position="static">
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {/* Logo */}
                <Box
                    component="img"
                    src="/logo.png"
                    alt="Logo"
                    sx={{
                        height: 40,
                        width: 40,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        objectPosition: 'center',  // Center the image within the box
                        backgroundColor: 'white',
                    }}
                />

                {/* Title */}
                <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
                    عادل السيال جلابية
                </Typography>

                {/* Profile Icon */}
                <Link to="/profile" style={{ textDecoration: 'none' }}>
                    <IconButton color="info" aria-label="profile" sx={{ color: 'white' }}>
                        <AccountCircle />
                    </IconButton>
                </Link>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
