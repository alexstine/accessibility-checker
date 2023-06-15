import React, { useEffect } from 'react';
import {useFloating, refs, floatingStyles, autoUpdate, offset, flip} from '@floating-ui/react'; //see: https://floating-ui.com/docs/tooltip
import './../../i18n';
import { useTranslation } from 'react-i18next';

import './style.scss';

const IssueButton = (props) => {

	const {
		anchor,
		focused,
		enabled,
		onClickEvent,
		issue
	} = props;

	
	const { t } = useTranslation();

	const {refs, floatingStyles} = useFloating({
		strategy: 'fixed',
		placement: 'left',
		middleware: [offset(15), flip()],
		elements: {
			reference: anchor
		},
		whileElementsMounted: autoUpdate,
	});
	

	const handleClickEvent = (e) => {
		onClickEvent(e,issue);
	}

	  
	useEffect(() => {
		if (focused) {
			refs.floating.current.focus();
	
		}
	}, [focused]);

	return (
		
		<button
			ref={refs.setFloating} style={floatingStyles}
			className={
				`edac-issue-button 
				edac-issue-button-${issue.impact}
				${!enabled ? "edac-disabled" : ""}
				`}
			title={t('TODO')}
			data-selector={issue.selector}
			onClick={handleClickEvent} />
	
	)
}

export default IssueButton;