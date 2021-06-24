import { css } from '@emotion/react';
import { styled, Theme } from '@material-ui/core/styles';
import React from 'react';
import { SnackbarProviderProps } from '.';
import { SNACKBAR_INDENTS } from './utils/constants';

const collapse = {
	container: '& > .MuiCollapse-container',
	wrapper: '& > .MuiCollapse-container > .MuiCollapse-wrapper',
};

const xsWidthMargin = 16;

interface SnackbarContainerProps {
	dense: SnackbarProviderProps['dense'];
	anchorOrigin: NonNullable<SnackbarProviderProps['anchorOrigin']>;
}

const rootDense = css`
	${collapse.wrapper} {
		padding: ${SNACKBAR_INDENTS.snackbar.dense}px 0px;
	}
`;

const top = css`
	top: ${SNACKBAR_INDENTS.view.default - SNACKBAR_INDENTS.snackbar.default}px;
	flex-direction: column;
`;

const bottom = css`
	bottom: ${SNACKBAR_INDENTS.view.default - SNACKBAR_INDENTS.snackbar.default}px;
	flex-direction: column-reverse;
`;

const left = (theme: Theme) => css`
	left: ${SNACKBAR_INDENTS.view.default}px;
	${theme.breakpoints.up('sm')} {
		align-items: flex-start;
	}
	${theme.breakpoints.down('xs')} {
		left: ${xsWidthMargin}px;
	}
`;

const right = (theme: Theme) => css`
	right: ${SNACKBAR_INDENTS.view.default}px;
	${theme.breakpoints.up('sm')} {
		align-items: flex-end;
	}
	${theme.breakpoints.down('xs')} {
		right: ${xsWidthMargin}px;
	}
`;

const SnackbarContainer = styled('div')<SnackbarContainerProps>`
	box-sizing: border-box;
	display: flex;
	max-height: 100%;
	position: fixed;
	z-index: ${(props) => props.theme.zIndex.snackbar};
	height: auto;
	width: auto;
	transition: top 300ms ease 0ms, right 300ms ease 0ms, bottom 300ms ease 0ms, left 300ms ease 0ms, margin 300ms ease 0ms, max-width 300ms ease 0ms;
	// container itself is invisible and should not block clicks, clicks should be passed to its children
	pointer-events: none;

	${collapse.container} {
		pointer-events: all;
	}
	${collapse.wrapper} {
		padding: ${SNACKBAR_INDENTS.snackbar.default}px 0px;
		transition: padding 300ms ease 0ms;
	}

	max-width: calc(100% - ${SNACKBAR_INDENTS.view.default * 2}px);

	${(props) => props.theme.breakpoints.down('xs')} {
		width: 100%;
		max-width: calc(100% - ${xsWidthMargin * 2}px);
	}

	${(props) => props.dense && rootDense}

	${(props) => props.anchorOrigin.vertical === 'top' && top}
	${(props) => props.anchorOrigin.horizontal === 'right' && right(props.theme)}
	${(props) => props.anchorOrigin.vertical === 'bottom' && bottom}
	${(props) => props.anchorOrigin.horizontal === 'left' && left(props.theme)}
`;

export default React.memo(SnackbarContainer);
