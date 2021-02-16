import IconButton from "@material-ui/core/IconButton";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Tooltip from "@material-ui/core/Tooltip";
import SettingsApplicationsOutlined from "@material-ui/icons/SettingsApplicationsOutlined";
import AccountCircle from "@material-ui/icons/AccountCircle";
import React from "react";
import { FormattedMessage } from "react-intl";
import { fetchAccount } from '../../../redux/clientSlice';
import AccountInfoDialog from './account-info-dialog';
import ChangePasswordDialog from './change-password-dialog';
import LockOpenOutlined from "@material-ui/icons/LockOpenOutlined";
import Link from "@material-ui/core/Link";
import ExitToAppOutlined from "@material-ui/icons/ExitToAppOutlined";

type ActionType = 'change-password' | 'account-info' | undefined;
const AccountMenu = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [action, setAction] = React.useState<ActionType>(undefined);


    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const account = fetchAccount();
    return (
        <span>
            <Tooltip title={`${account?.firstname} ${account?.lastname} <${account?.email}>`}>
                <IconButton
                    onClick={handleMenu}>
                    <AccountCircle fontSize="large" style={{ color: 'black' }} />
                </IconButton >
            </Tooltip>
            <Menu id="appbar-profile"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                getContentAnchorEl={null}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={() => { handleClose(), setAction('account-info') }}>
                    <ListItemIcon>
                        <SettingsApplicationsOutlined fontSize="small" />
                    </ListItemIcon>
                    <FormattedMessage id="menu.account" defaultMessage="Account" />
                </MenuItem>

                <MenuItem onClick={() => { handleClose(), setAction('change-password') }}>
                    <ListItemIcon>
                        <LockOpenOutlined fontSize="small" />
                    </ListItemIcon>
                    <FormattedMessage id="menu.change-password" defaultMessage="Change password" />
                </MenuItem>

                <MenuItem onClick={handleClose}>
                    <Link color="textSecondary" href="/c/logout">
                        <ListItemIcon>
                            <ExitToAppOutlined fontSize="small" />
                        </ListItemIcon>
                        <FormattedMessage id="menu.signout" defaultMessage="Sign Out" />
                    </Link>
                </MenuItem>
            </Menu>
            {action == 'change-password' &&
                <ChangePasswordDialog onClose={() => setAction(undefined)} />
            }
            {action == 'account-info' &&
                <AccountInfoDialog onClose={() => setAction(undefined)} />
            }
        </span>);
}



export default AccountMenu;