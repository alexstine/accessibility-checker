
import React from 'react';
import { createRoot } from 'react-dom/client';
import PanelContainer from './components/PanelContainer';
import { scan } from './scanner';


//TODO: need store? @reduxjs/toolkit?



const App = () => {
	return (
		<PanelContainer />
	)
}



window.addEventListener('DOMContentLoaded', () => {

	
	if (edac_script_vars.active == true) {

		// Check if we are loading the app from within the editor
		if(edac_script_vars.mode === 'autoscan'){
		
			// We are in the editor, so create an iframe for loading the page preview
			const iframe = document.createElement('iframe');
			iframe.setAttribute('src', edac_script_vars.autoscanUrl);
			iframe.style.width ='1px !important;';
			iframe.style.height='1px !important;';
			iframe.style.position='absolute !important;';
			iframe.style.left = '-1px !important;';
			document.body.append(iframe);

		} else {

			//We are loading the app in the page preview
			const queryString = window.location.search;
			const urlParams = new URLSearchParams(queryString);
			const edacAction = urlParams.get('edac-action');
		
			if(edacAction === 'autoscan'){
				// This page preview is being loaded from within the editor's iframe because we want to run an autoscan
		
				scan().then((results) => {
			
				//TODO: pull results into enque, then look for changes and only post those
				//post results to DB
				console.log(results.violations);

			}).catch((err) => {
				//TODO:
				console.log(err);
			});

			} else {

				// We are loading the app in a normal page preview so show the user the ui
				const rootEl = document.createElement('div');
				document.body.append(rootEl);
				createRoot(rootEl).render(<App />);
	
			}
	
		}



	
	}
});

