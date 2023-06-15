
import React from 'react';
import { createRoot } from 'react-dom/client';
import PanelContainer from './components/PanelContainer';

//TODO: need store? @reduxjs/toolkit?


	
const App = () => {
    return (
		<PanelContainer />
    )
}



window.addEventListener('DOMContentLoaded', () => {
	const rootEl = document.createElement('div');
	document.body.append(rootEl);
	
	createRoot(rootEl).render(<App />);
	/*
	//TODO:
	if( true == edac_script_vars.active ) {
		new AccessibilityCheckerHighlight();
		new AccessibilityCheckerDisableHTML();


	}
	*/
});

