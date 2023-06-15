import React, { useEffect, useRef} from 'react';
import { FocusOn } from 'react-focus-on';

import './../../i18n';
import { useTranslation } from 'react-i18next';


import './style.scss';

const PanelControls = (props) => {

	const {
		enabled,
		focusLock,
		summary,
		issuesIndex,
		issuesCount,
		isVisible,
		stylesEnabled,
		onNextClickEvent,
		onPrevClickEvent,
		onStylesClickEvent,
		onCloseClickEvent,
		onFocusBlurredEvent
	} = props;

	
	
	const { t } = useTranslation();

	const closeRef = useRef();


	useEffect(() => {
		if(focusLock){
			closeRef.current.focus();
		}
	}, []);

	

	return (
		<>
			{isVisible &&
				<FocusOn enabled={focusLock} noIsolation scrollLock={false} onClickOutside={onFocusBlurredEvent} onEscapeKey={onFocusBlurredEvent}>
					<div className={`edac-panel-controls ${!enabled ? "edac-disabled" : ""}`}>
			
						<button disabled={!enabled} className="edac-panel-controls-close" 
						aria-label={t('Close accessibility highlights panel')} onClick={onCloseClickEvent} ref={closeRef}>×</button>
						<div className="edac-panel-controls-title">{t('Accessibility Checker')}</div>
						<div className="edac-panel-controls-summary">{t(summary)}</div>
						<div className="edac-panel-controls-buttons">
							<div>
								<button disabled={!enabled} className="edac-panel-controls-previous" onClick={onPrevClickEvent}><span aria-hidden="true">« </span>{t('Previous')}</button>
								<button disabled={!enabled} className="edac-panel-controls-next" onClick={onNextClickEvent}>{t('Next')}<span aria-hidden="true"> »</span></button><br />
							</div>

							<div>
								{stylesEnabled &&
									<button disabled={!enabled} className="edac-panel-controls-disable-styles" onClick={onStylesClickEvent}>{t('Disable Styles')}</button>
								}
								{!stylesEnabled &&
									<button disabled={!enabled} className="edac-panel-controls-enable-styles" onClick={onStylesClickEvent}>{t('Enable Styles')}</button>
								}
							</div>
						</div>

						{issuesCount > 0 && issuesIndex !== undefined &&
							<div style={{ textAlign: 'center' }}>
								<span>{issuesIndex + 1}</span>
								<span>&nbsp;of&nbsp;</span>
								<span>{issuesCount}</span>
							</div>
						}


					</div>
				</FocusOn>
			}
		</>
	)
}

export default PanelControls;