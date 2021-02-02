import React from "react";
import { Button, DialogContentText } from "@material-ui/core";
import { FormattedMessage, useIntl } from "react-intl";
import { ErrorInfo } from "../../../../client";
import { StyledDialog, StyledDialogActions, StyledDialogContent, StyledDialogTitle } from "./style";
import GlobalError from "../../../form/global-error";

export type DialogProps = {
    onClose: () => void;
    onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
    open: boolean;
    children: any;
    error?: ErrorInfo;

    title: string;
    description?: string;
    submitButton?: string;
}

const BaseDialog = (props: DialogProps) => {
    const intl = useIntl();
    const handleOnClose = props.onClose;
    const onSubmit = props.onSubmit;
    const isOpen = props.open;


    const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(e);
        }
    }

    const description = props.description ? (<DialogContentText>{props.description}</DialogContentText>) : null;

    return (
        <div>
            <StyledDialog
                open={isOpen}
                onClose={handleOnClose}
                maxWidth="sm"
                fullWidth={true}>
                <form autoComplete="off" onSubmit={handleOnSubmit}>
                    <StyledDialogTitle>
                        {props.title}
                    </StyledDialogTitle>

                    <StyledDialogContent>
                        {description}
                        <GlobalError error={props.error} />
                        {props.children}
                    </StyledDialogContent>

                    <StyledDialogActions>
                        <Button
                            type="button"
                            color="primary"
                            size="medium"
                            onClick={handleOnClose} >
                            {onSubmit ? (<FormattedMessage id="action.cancel-button" defaultMessage="Cancel" />) :
                                (<FormattedMessage id="action.close-button" defaultMessage="Close" />)
                            }
                        </Button>
                        {onSubmit ? (
                            <Button
                                color="primary"
                                size="medium"
                                variant="contained"
                                type="submit"
                                disableElevation={true}>
                                {props.submitButton}
                            </Button>) : null
                        }
                    </StyledDialogActions>
                </form>
            </StyledDialog>
        </div>
    );
}

export default BaseDialog;