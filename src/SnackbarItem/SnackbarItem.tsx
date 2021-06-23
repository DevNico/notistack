import { css } from '@emotion/react';
import Collapse from '@material-ui/core/Collapse';
import { emphasize, styled } from '@material-ui/core/styles';
import React, { useEffect, useRef, useState } from 'react';
import { RequiredBy, SharedProps, SnackbarProviderProps as ProviderProps, TransitionHandlerProps, VariantType } from '../index';
import SnackbarContent from '../SnackbarContent';
import { Snack } from '../SnackbarProvider';
import { DEFAULTS, objectMerge, REASONS } from '../utils/constants';
import createChainedFunction from '../utils/createChainedFunction';
import defaultIconVariants from '../utils/defaultIconVariants';
import Snackbar from './Snackbar';
import { getTransitionDirection } from './SnackbarItem.util';

const contentRoot = css`
	position: relative;
	transform: translateX(0);
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
`;

const StyledSnackbar = styled(Snackbar)`
	${(props) => props.theme.typography.body2};
	background-color: ${(props) =>
		emphasize(props.theme.palette.background.default, (props.theme.palette.mode || props.theme.palette.type) === 'light' ? 0.8 : 0.98)};
	${contentRoot}
`;

const variantSuccess = css`
	background-color: #43a047; // green
	color: #fff;
`;
const variantError = css`
	background-color: #d32f2f; // dark red
	color: #fff;
`;
const variantInfo = css`
	background-color: #2196f3; // nice blue
	color: #fff;
`;
const variantWarning = css`
	background-color: #ff9800; // amber
	color: #fff;
`;

interface StyledSnackbarContentProps {
	lessPadding: boolean;
	variant: VariantType;
}

const StyledSnackbarContent = styled(SnackbarContent)<StyledSnackbarContentProps>`
	${contentRoot}
	${(props) => props.lessPadding && `padding-left: ${8 * 2.5}px;`}
    ${(props) => props.variant === 'success' && variantSuccess}
    ${(props) => props.variant === 'error' && variantError}
    ${(props) => props.variant === 'info' && variantInfo}
    ${(props) => props.variant === 'warning' && variantWarning}
`;

const Message = styled('div')`
	display: flex;
	align-items: center;
	padding: 8px 0;
`;

const Action = styled('div')`
	display: flex;
	align-items: center;
	margin-left: auto;
	padding-left: 16px;
	margin-right: -8px;
`;

type RemovedProps =
	| 'variant' // the one received from Provider is processed and passed to snack prop
	| 'anchorOrigin' // same as above
	| 'autoHideDuration' // same as above
	| 'preventDuplicate'; // the one recevied from enqueueSnackbar is processed in provider, therefore shouldn't be passed to SnackbarItem */

export interface SnackbarItemProps extends RequiredBy<Omit<SharedProps, RemovedProps>, 'onEntered' | 'onExited' | 'onClose'> {
	snack: Snack;
	dense: ProviderProps['dense'];
	iconVariant: ProviderProps['iconVariant'];
	hideIconVariant: ProviderProps['hideIconVariant'];
}

const SnackbarItem: React.FC<SnackbarItemProps> = (props) => {
	const timeout = useRef<ReturnType<typeof setTimeout>>();
	const [collapsed, setCollapsed] = useState(true);

	useEffect(
		() => (): void => {
			if (timeout.current) {
				clearTimeout(timeout.current);
			}
		},
		[]
	);

	const handleClose = createChainedFunction([props.snack.onClose, props.onClose], props.snack.key);

	const handleEntered: TransitionHandlerProps['onEntered'] = () => {
		if (props.snack.requestClose) {
			handleClose(null, REASONS.INSTRCUTED);
		}
	};

	const handleExitedScreen = (): void => {
		timeout.current = setTimeout(() => {
			setCollapsed(!collapsed);
		}, 125);
	};

	const {
		style,
		dense,
		ariaAttributes: otherAriaAttributes,
		className: otherClassName,
		hideIconVariant,
		iconVariant,
		snack,
		action: otherAction,
		content: otherContent,
		TransitionComponent: otherTranComponent,
		TransitionProps: otherTranProps,
		transitionDuration: otherTranDuration,
		onEnter: ignoredOnEnter,
		onEntered: ignoredOnEntered,
		onEntering: ignoredOnEntering,
		onExit: ignoredOnExit,
		onExited: ignoredOnExited,
		onExiting: ignoredOnExiting,
		...other
	} = props;

	const {
		persist,
		key,
		open,
		entered,
		requestClose,
		className: singleClassName,
		variant,
		content: singleContent,
		action: singleAction,
		ariaAttributes: singleAriaAttributes,
		anchorOrigin,
		message: snackMessage,
		TransitionComponent: singleTranComponent,
		TransitionProps: singleTranProps,
		transitionDuration: singleTranDuration,
		onEnter,
		onEntered,
		onEntering,
		onExit,
		onExited,
		onExiting,
		...singleSnackProps
	} = snack;

	const icon = {
		...defaultIconVariants,
		...iconVariant,
	}[variant];

	const ariaAttributes = {
		'aria-describedby': 'notistack-snackbar',
		...objectMerge(singleAriaAttributes, otherAriaAttributes),
	};

	const TransitionComponent = singleTranComponent || otherTranComponent || DEFAULTS.TransitionComponent;
	const transitionDuration = objectMerge(singleTranDuration, otherTranDuration, DEFAULTS.transitionDuration);
	const transitionProps = {
		direction: getTransitionDirection(anchorOrigin),
		...objectMerge(singleTranProps, otherTranProps),
	};

	let action = singleAction || otherAction;
	if (typeof action === 'function') {
		action = action(key);
	}

	let content = singleContent || otherContent;
	if (typeof content === 'function') {
		content = content(key, snack.message);
	}

	const callbacks: { [key in keyof TransitionHandlerProps]?: any } = ['onEnter', 'onEntering', 'onEntered', 'onExit', 'onExiting', 'onExited'].reduce(
		(acc, cbName) => ({
			...acc,
			// @ts-ignore
			[cbName]: createChainedFunction([props.snack[cbName], props[cbName]], props.snack.key),
		}),
		{}
	);

	return (
		<Collapse unmountOnExit timeout={175} in={collapsed} onExited={callbacks.onExited}>
			{/* @ts-ignore */}
			<StyledSnackbar {...other} {...singleSnackProps} open={open} onClose={handleClose}>
				{/* @ts-ignore */}
				<TransitionComponent
					appear
					in={open}
					timeout={transitionDuration}
					{...transitionProps}
					onExit={callbacks.onExit}
					onExiting={callbacks.onExiting}
					onExited={handleExitedScreen}
					onEnter={callbacks.onEnter}
					onEntering={callbacks.onEntering}
					// order matters. first callbacks.onEntered to set entered: true,
					// then handleEntered to check if there's a request for closing
					onEntered={createChainedFunction([callbacks.onEntered, handleEntered])}
				>
					{/* @ts-ignore */}
					{content || (
						<StyledSnackbarContent
							{...ariaAttributes}
							{...ariaAttributes}
							role="alert"
							lessPadding={!hideIconVariant && icon !== undefined}
							variant={variant}
							style={style}
						>
							<Message id={ariaAttributes['aria-describedby']}>
								{!hideIconVariant ? icon : null}
								{snackMessage}
							</Message>
							{action && <Action>{action}</Action>}
						</StyledSnackbarContent>
					)}
				</TransitionComponent>
			</StyledSnackbar>
		</Collapse>
	);
};

export default SnackbarItem;
