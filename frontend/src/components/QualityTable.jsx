import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton
} from '@material-ui/core';
import DeleteIcon from "@material-ui/icons/Delete";
import { useSelector } from 'react-redux';

import { removeRepo } from '../store/actions'


const useStyles = makeStyles({
  table: {
    maxWidth: 650
  }
});

export default function QualityTable() {
  const classes = useStyles();

  const { repo = {} } = useSelector((state) => state.repoState);

  const rows = Object.keys(repo).map(key => repo[key]);

  const removeRow = row => {
    removeRepo(row.id)
  };

  return (
    <TableContainer component={Paper} className={classes.table} >
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Repository</TableCell>
            <TableCell align="right">#Issues</TableCell>
            <TableCell align="right">Avg Age</TableCell>
            <TableCell align="right">Std Age</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.repo}
              </TableCell>
              <TableCell align="right">{row.qty_issues}</TableCell>
              <TableCell align="right">{row.avg_age}</TableCell>
              <TableCell align="right">{row.std_age}</TableCell>
              <TableCell align="right">
                <IconButton
                  color="secondary"
                  aria-label="remove row"
                  onClick={() => removeRow(row)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
