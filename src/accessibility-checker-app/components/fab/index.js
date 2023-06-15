import React, { useEffect, useRef } from 'react';
import './../../i18n';
import { useTranslation } from 'react-i18next';

import './style.scss';

const FAB = (props) => {

	const {
		enabled,
		focused,
		onClickEvent
	} = props;

	const closeRef = useRef();

	const { t } = useTranslation();


	useEffect(() => {
		if (focused) {
			closeRef.current.focus();
		}
	}, [focused]);

	return (

		<button
			ref={closeRef}
			disabled={!enabled}
			className={`edac-fab ${!enabled ? "edac-disabled" : ""}`}
			title={t('Toggle accessibility tools')}
			onClick={onClickEvent}
		/>
	)
}

export default FAB;