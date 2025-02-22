import Slide from '@material-ui/core/Slide';
import { SnackbarClassKey } from '@material-ui/core/Snackbar';
import { CloseReason, ContainerClassKey, VariantType, SnackbarOrigin, VariantClassKey } from '../index';
import { Snack } from '../SnackbarProvider';

export const MESSAGES = {
	NO_PERSIST_ALL:
		"WARNING - notistack: Reached maxSnack while all enqueued snackbars have 'persist' flag. Notistack will dismiss the oldest snackbar anyway to allow other ones in the queue to be presented.",
};

export const SNACKBAR_INDENTS = {
	view: { default: 20, dense: 4 },
	snackbar: { default: 6, dense: 2 },
};

export const DEFAULTS = {
	maxSnack: 3,
	dense: false,
	hideIconVariant: false,
	variant: 'default' as VariantType,
	autoHideDuration: 5000,
	anchorOrigin: { vertical: 'bottom', horizontal: 'left' } as SnackbarOrigin,
	TransitionComponent: Slide,
	transitionDuration: {
		enter: 225,
		exit: 195,
	},
};

export const capitalise = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1);

export const originKeyExtractor = (anchor: Snack['anchorOrigin']): string => `${capitalise(anchor.vertical)}${capitalise(anchor.horizontal)}`;

export const REASONS: { [key: string]: CloseReason } = {
	TIMEOUT: 'timeout',
	CLICKAWAY: 'clickaway',
	MAXSNACK: 'maxsnack',
	INSTRUCTED: 'instructed',
};

/** Tranforms classes name */
export const transformer = {
	toContainerAnchorOrigin: (origin: string) => `containerAnchorOrigin${origin}` as ContainerClassKey,
	toAnchorOrigin: ({ vertical, horizontal }: SnackbarOrigin) => `anchorOrigin${capitalise(vertical)}${capitalise(horizontal)}` as SnackbarClassKey,
	toVariant: (variant: VariantType) => `variant${capitalise(variant)}` as VariantClassKey,
};

export const isDefined = (value: string | null | undefined | number): boolean => !!value || value === 0;

const numberOrNull = (numberish?: number | null) => typeof numberish === 'number' || numberish === null;

// @ts-ignore
export const merge = (options, props, defaults) => (name: keyof Snack): any => {
	if (name === 'autoHideDuration') {
		if (numberOrNull(options.autoHideDuration)) return options.autoHideDuration;
		if (numberOrNull(props.autoHideDuration)) return props.autoHideDuration;
		return DEFAULTS.autoHideDuration;
	}

	return options[name] || props[name] || defaults[name];
};

export function objectMerge(options = {}, props = {}, defaults = {}) {
	return {
		...defaults,
		...props,
		...options,
	};
}
