import React from 'react';
import { TextField, InputAdornment, IconButton } from '@material-ui/core';
import SearchIcon from "@material-ui/icons/Search";

import { addRepo } from '../store/actions';

export default function QualitySearch() {
    const [repo, setRepo] = React.useState({
        repoName: "",
    });

    const handleChange = event => {
        setRepo({ repoName: event.target.value });
    };

    const handleClick = event => {
        addRepo(repo.repoName);
        event.preventDefault();
    };

    return (
        <>
            <TextField
                id="outlined-full-width"
                label="Type in your favorite library name"
                style={{ margin: 8, width: '600px' }}
                placeholder="Lib"
                helperText="Type in react, vue or angular!"
                margin="normal"
                onChange={handleChange}
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment>
                            <IconButton onClick={handleClick}>
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                    )
                }}
                variant="outlined"
            />
        </>
    )
}