import { styled } from '@material-ui/core/styles';
import { SnackbarContentProps } from '../index';

const SnackbarContent = styled('div')<SnackbarContentProps>`
	display: flex;
	flex-wrap: flex;
	flex-grow: 1;

	${(props) => props.theme.breakpoints.up('sm')} {
		flex-grow: initial;
		min-width: 288px;
	}
`;

export default SnackbarContent;
