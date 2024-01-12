import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import makeStyles from '@mui/styles/makeStyles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ClearIcon from '@mui/icons-material/Clear';
import Alert from 'AppComponents/Shared/Alert';
import { FormattedMessage } from 'react-intl';

const useStyles = makeStyles((theme) => ({
    mandatoryStar: {
        color: theme.palette.error.main,
        marginLeft: theme.spacing(0.1),
    },
    table: {
        margin: 10,
        '& tr td, & tr th': {
            padding: 5,
            margin: 0,
        },
    },
    acitonColumn: {
        width: 50,
    },
}));

/**
 * Claim Mapping Creation Form
 * @export
 * @param {*} props
 * @returns {React.Component}
 */
export default function ClaimMappings(props) {
    const classes = useStyles();
    const [newRemoteClaim, setRemoteClaim] = useState('');
    const [newLocalClaim, setLocalClaim] = useState('');
    const { claimMappings, setClaimMapping } = props;
    const [validationError, setValidationError] = useState([]);

    const onChange = (e) => {
        const { id, value } = e.target;
        if (id === 'remoteClaim') {
            setRemoteClaim(value);
        } else if (id === 'localClaim') {
            setLocalClaim(value);
        }
    };
    const validate = (fieldName, value) => {
        let error = '';
        if (value === null || value === '') {
            error = 'Claim is Empty';
        } else {
            error = '';
        }
        setValidationError({ fieldName: error });
        return error;
    };

    const clearValues = () => {
        setLocalClaim(null);
        setRemoteClaim(null);
    };
    const handleAddToList = () => {
        const remoteClaimError = validate('remoteClaim', newRemoteClaim);
        const localClaimError = validate('localClaim', newLocalClaim);
        if (localClaimError !== '' || remoteClaimError !== '') {
            Alert.error(remoteClaimError);
            clearValues();
            return false;
        } else {
            let exist = false;
            claimMappings.map(({ remoteClaim }) => {
                if (remoteClaim === newRemoteClaim) {
                    Alert.error(<FormattedMessage
                        id='Claim.Mapping.already.exists'
                        defaultMessage='Claim Mapping already exists.'
                    />);
                    clearValues();
                    exist = true;
                }
                return false;
            });
            if (!exist) {
                const claimMapping = {
                    remoteClaim: newRemoteClaim,
                    localClaim: newLocalClaim,
                };
                claimMappings.push(claimMapping);
                setClaimMapping(claimMappings);
                clearValues();
            }
            return true;
        }
    };
    const onDelete = (claimKey) => {
        const newMapping = claimMappings.filter(({ remoteClaim }) => remoteClaim !== claimKey);
        setClaimMapping(newMapping);
    };
    return (
        <Box mt={2}>
            <Table className={classes.table} aria-label='simple table'>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <FormattedMessage id='Keymanager.Remote.Claim' defaultMessage='Remote Claim' />
                        </TableCell>
                        <TableCell align='right'>
                            <FormattedMessage id='Keymanager.Local.Claim' defaultMessage='Local Claim' />
                        </TableCell>
                        <TableCell align='right' className={classes.acitonColumn}>
                            <FormattedMessage id='Keymanager.Claim.Action' defaultMessage='Action' />
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow key='Add new'>
                        <TableCell component='th' scope='row'>
                            <TextField
                                id='remoteClaim'
                                label={(
                                    <FormattedMessage
                                        id='Keymanager.Remote.Claim'
                                        defaultMessage='Remote Claim'
                                    />
                                )}
                                variant='outlined'
                                margin='dense'
                                onChange={onChange}
                                error={validationError.remoteClaim}
                                helperText={validationError.remoteClaim && validationError.remoteClaim}
                                value={newRemoteClaim === null ? '' : newRemoteClaim}
                                fullWidth
                            />
                        </TableCell>
                        <TableCell align='right'>
                            <TextField
                                id='localClaim'
                                label={(
                                    <FormattedMessage
                                        id='Keymanager.Local.Claim'
                                        defaultMessage='Local Claim'
                                    />
                                )}
                                value={newLocalClaim === null ? '' : newLocalClaim}
                                onChange={onChange}
                                error={validationError.localClaim}
                                helperText={validationError.localClaim && validationError.localClaim}
                                variant='outlined'
                                margin='dense'
                                fullWidth
                            />
                        </TableCell>
                        <TableCell>
                            <Box display='flex'>
                                <IconButton
                                    id='delete'
                                    aria-label={(
                                        <FormattedMessage
                                            id='Keymanager.Local.Claim.remove'
                                            defaultMessage='Remove'
                                        />
                                    )}
                                    onClick={handleAddToList}
                                    size='large'
                                >
                                    <AddCircleIcon />
                                </IconButton>
                                <IconButton
                                    id='delete'
                                    aria-label='Clear'
                                    onClick={clearValues}
                                    size='large'
                                >
                                    <ClearIcon />
                                </IconButton>
                            </Box>
                        </TableCell>
                    </TableRow>
                    {claimMappings.map(({ remoteClaim, localClaim }) => (
                        <TableRow key={localClaim}>
                            <TableCell component='th' scope='row'>
                                <Typography
                                    variant='body1'
                                    gutterBottom
                                    id='claim.mapping..remote.claim.body'
                                >
                                    {remoteClaim}
                                </Typography>
                            </TableCell>
                            <TableCell align='right'>
                                <Typography
                                    variant='body1'
                                    gutterBottom
                                    id='claim.mapping.local.claim.body'
                                >
                                    {localClaim}
                                </Typography>
                            </TableCell>
                            <TableCell align='right'>
                                <IconButton
                                    id='delete'
                                    aria-label='Remove'
                                    onClick={() => { onDelete(remoteClaim); }}
                                    size='large'
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );
}

ClaimMappings.defaultProps = {
    claimMappings: [],
    required: false,
    helperText: (<FormattedMessage id='KeyManager.Claim.Helper.text' defaultMessage='Add Claim Mappings' />),
};
