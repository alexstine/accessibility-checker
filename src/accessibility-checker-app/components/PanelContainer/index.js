import React, { useState, useEffect } from 'react';
const md5 = require('md5');
import Draggable from "react-draggable";
import { scan } from './../../scanner';
import FAB from "./../FAB";
import PanelControls from "./../PanelControls";
import IssueButton from "./../IssueButton";
import IssueDetails from "./../IssueDetails";


import './../../i18n';
import { useTranslation } from 'react-i18next';

import './style.scss';

const PanelContainer = () => {

	const [isDraggable, setIsDraggable] = useState(false);
	const [focusFAB, setFocusFAB] = useState(true);
	const [focusLockControls, setFocusLockControls] = useState(false);
	const [focusLockIssueDetail, setFocusLockIssueDetail] = useState(false);
	const [visibleControls, setVisibleControls] = useState(false);
	const [visibleIssueDetail, setVisibleIssueDetail] = useState(false);
	const [stylesEnabled, setStylesEnabled] = useState(true);
	const [issues, setIssues] = useState([]);
	const [urlSelectedIssueHash, setUrlSelectedIssueHash] = useState('');
	const [currentIssueIndex, setCurrentIssueIndex] = useState();
	const [currentIssue,setCurrentIssue] = useState();
	
	const { t } = useTranslation();
	
	const isReducedMotion = window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

	const handleOnMouseEnterEvent = (e) => {
		setIsDraggable(true);
	};

	const handleOnMouseLeaveEvent = (e) => {
		setIsDraggable(false);
	};

	const handleOnFabClickEvent = (e) => {
		setVisibleControls(!visibleControls);
	};

	const handleOnIssueClickEvent = (e, data) => {
		issues.forEach((issue, index) => {
			if(issue == data){
				setCurrentIssueIndex(index);
			}
		});
	}

	const handleOnNextClickEvent = (e) => {

		if (currentIssueIndex === undefined || currentIssueIndex == issues.length - 1) {
			setCurrentIssueIndex(0);
		} else {
			setCurrentIssueIndex(currentIssueIndex + 1);
		}

	};

	const handleOnPrevClickEvent = (e) => {
		if (currentIssueIndex == 0) {
			setCurrentIssueIndex(issues.length - 1);
		} else {
			if (currentIssueIndex === undefined) {
				setCurrentIssueIndex(0);
			} else {
				setCurrentIssueIndex(currentIssueIndex - 1);
			}
		};

	}

	const handleOnPanelControlsCloseClickEvent = (e) => {
		setVisibleControls(false);
	};

	const handleOnPanelControlsFocusBlurredEvent = (e) => {
		setFocusLockControls(false);	
	};


	const handleOnStylesClickEvent = (e) => {
		setStylesEnabled(!stylesEnabled);
	};

	const handleOnIssueDetailsCloseClickEvent = (e) => {
		setVisibleIssueDetail(false);
	};

	const handleOnIssueDetailsFocusBlurredEvent = (e) => {
		setFocusLockControls(false);	
	};

	const selectCurrentElement = () => {
		if(currentIssue !== undefined){
			const element = document.querySelector(currentIssue.selector);
			element.classList.add('edac-element-selected');
			
			let options = {
				block: 'center',
				behavior: 'instant'
			};
		
			if(!isReducedMotion){
				options.behavior = 'smooth';
			}
			element.scrollIntoView(options);			
		
			setVisibleIssueDetail(true);

		}

		
	};

	const clearSelectedElements = () => {
		document.querySelectorAll('.edac-element-selected').forEach(element => {
			element.classList.remove('edac-element-selected');
		});
	};

	const getIssues = () => {
		scan().then((issues) => {
			setIssues(issues);

			/* TODO: don't load first issue by default
			if (currentIssueIndex == undefined) {
				setCurrentIssueIndex(0);
			}
			*/

		}).catch((err) => {
			//TODO:
			console.log(err);
		});

	};



	useEffect(() => {

		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		const selectedElement = urlParams.get('edac-element-selected');
		//TODO: e9390fcb0435cc89e2f463f9cca0f715
		if (selectedElement !== null) {
			setUrlSelectedIssueHash(selectedElement);
			setVisibleControls(true);
		}

	}, []);

	
	useEffect(() => {

		clearSelectedElements();
		
		if (visibleControls) {
			getIssues();
			selectCurrentElement();
			setFocusFAB(false);
			setFocusLockControls(true);
		} else {
			setIssues([]);
			setVisibleIssueDetail(false);
			setFocusLockControls(false);
			setFocusFAB(true);
		}
	}, [visibleControls]);

	useEffect(() => {
		setCurrentIssue(issues[currentIssueIndex]);
	}, [currentIssueIndex]);

	useEffect(() => {
		
		if(currentIssue !== undefined){
			
			clearSelectedElements();
			selectCurrentElement();
	
		}
	}, [currentIssue]);


	useEffect(() => {
		if (visibleIssueDetail) {
			setFocusLockControls(false);
			setFocusLockIssueDetail(true);
		} else {
			setFocusLockControls(false);
			setFocusLockIssueDetail(false);
			setFocusFAB(true);
		}
	}, [visibleIssueDetail]);

	
	useEffect(() => {


		if (visibleControls && issues.length > 0) {

			if (urlSelectedIssueHash !== '') {

				let match = false;
				issues.forEach((issue, index) => {

					if (md5(issue.html) === urlSelectedIssueHash) {
						setCurrentIssueIndex(index);
						match = true;
					}

				});

				setUrlSelectedIssueHash('');

				if (!match) {
					setVisibleControls(false);
				}

			}

		}
	}, [issues]);



	
	return (
		<div className='edac-app'>
			<Draggable 
			axis="both" disabled={!isDraggable}  handle=".edac-panel-container-drag-handle">
				<div className={`edac-panel-container 
					${isDraggable ? "react-draggable-enabled" : "react-draggable-disabled"}
					${visibleControls ? "controls-visible" : "controls-not-visible"}
					${visibleIssueDetail ? "issue-detail-visible" : "issue-detail-not-visible"}
					`}
				>
					<div className="edac-panel-container-drag-handle"
						onMouseEnter={handleOnMouseEnterEvent}
						onMouseLeave={handleOnMouseLeaveEvent}
					/>


					<IssueDetails
						enabled={!isDraggable}
						focusLock={focusLockIssueDetail}
						issue={currentIssue}
						isVisible={visibleIssueDetail}
						onCloseClickEvent={handleOnIssueDetailsCloseClickEvent}
						onFocusBlurredEvent={handleOnIssueDetailsFocusBlurredEvent} 
					/>
					<PanelControls
						enabled={!isDraggable}
						focusLock={focusLockControls}
						summary={currentIssue !== undefined ? currentIssue.title : ""}
						issuesIndex={currentIssueIndex}
						issuesCount={issues.length}
						isVisible={visibleControls}
						stylesEnabled={stylesEnabled}
						onNextClickEvent={handleOnNextClickEvent}
						onPrevClickEvent={handleOnPrevClickEvent}
						onStylesClickEvent={handleOnStylesClickEvent}
						onCloseClickEvent={handleOnPanelControlsCloseClickEvent}
						onFocusBlurredEvent={handleOnPanelControlsFocusBlurredEvent} 
					/>
					<div style={{ height: "100px", minHeight: "100px" }} />

					
					<FAB
						enabled={!isDraggable}
						focused={focusFAB}
						onClickEvent={handleOnFabClickEvent}
					/>

					<div className="edac-panel-container-drag-handle"
						onMouseEnter={handleOnMouseEnterEvent}
						onMouseLeave={handleOnMouseLeaveEvent}
					/>

				</div>
			</Draggable>

			{issues.map(issue => (
				<IssueButton 
					key={issue.selector} enabled={true} 
					issue={issue} anchor={document.querySelector(issue.selector)} 
					onClickEvent={handleOnIssueClickEvent}
				/>
			))}

		</div>




	)
}

export default PanelContainer;