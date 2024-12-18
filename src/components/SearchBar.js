import React, { useState } from 'react';
import { 
    TextField, 
    Box, 
    InputAdornment 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        onSearch(query);  // Trigger the search functionality
    };

    return (
        <Box 
            display="flex" 
            justifyContent="center" 
            width="100%"
            sx={{ padding: '10px 0' }} // Added padding around the search bar
        >
            <TextField
                variant="outlined"
                placeholder="Search Blog Posts..."
                value={searchQuery}
                onChange={handleSearch}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon sx={{ color: '#757575' }} /> {/* Light gray for the icon */}
                        </InputAdornment>
                    ),
                }}
                sx={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '25px', // Rounded edges
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
                    minWidth: '300px',
                    maxWidth: '500px',
                    flexGrow: 1,
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '25px', // Ensures the input itself has rounded borders
                        '& fieldset': {
                            borderColor: '#DDDDDD', // Light gray border
                        },
                        '&:hover fieldset': {
                            borderColor: '#3A86FF', // Blue border on hover
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#3A86FF', // Blue border when focused
                        },
                    },
                }}
            />
        </Box>
    );
};

export default SearchBar;
