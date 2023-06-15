import React, {  useState, useEffect, useRef } from 'react';
import { FocusOn } from 'react-focus-on';
import './../../i18n';
import { useTranslation } from 'react-i18next';


import './style.scss';

const IssueDetails = (props) => {

	const {
		issue,
		enabled,
		focusLock,
		isVisible,
		onCloseClickEvent,
		onFocusBlurredEvent
	} = props;

	
	const closeRef = useRef();

	const { t } = useTranslation();
	
	const [issueState, setIssueState] = useState(issue);

	
	useEffect(() => {
		if(focusLock){
			closeRef.current.focus();
		}
	}, [issue]);

	

	return (
		<>
			{isVisible && issue!==undefined &&
				<FocusOn enabled={focusLock} noIsolation scrollLock={false} onClickOutside={onFocusBlurredEvent} onEscapeKey={onFocusBlurredEvent}>
					<div className={`edac-panel-issue-details ${!enabled ? "edac-disabled" : ""}`}>
						<button disabled={!enabled} className="edac-panel-issue-details-close" 
						aria-label={t('Close')} onClick={onCloseClickEvent} ref={closeRef}>×</button>
						<div className="edac-panel-issue-details-title">{t(issue.id)}</div>
						<div className="edac-panel-issue-details-content">{t(issue.help)}.</div>
						<div className="edac-panel-issue-details-code"><code>{issue.html}</code></div>
					
					</div>
				</FocusOn>
			}
		</>
	)
}

export default IssueDetails;