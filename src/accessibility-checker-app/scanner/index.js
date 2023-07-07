import 'axe-core';

//TODO: 			
//see: https://www.youtube.com/watch?v=AtsX0dPCG_4
//see: https://github.com/dequelabs/axe-core/blob/develop/doc/developer-guide.md#api-reference
//see: https://www.deque.com/axe/core-documentation/api-documentation/

export async function scan(
	options = { configOptions: {}, runOptions: {} }
) {


	const context = { exclude: ['#wpadminbar', '.edac-panel-container'] };

	const defaults = {
		configOptions: {
			reporter: "raw"
		},
		runOptions: {
			runOnly: {
				type: 'tag',
				values: [
					'wcag2a', 'wcag2aa', 'wcag2aaa',
					'wcag21a', 'wcag21aa',
					'wcag22aa',
					'best-practice',
					'ACT',
					'section508',
					'TTv5',
					'experimental'
				]
			}
		}
	};

	const configOptions = Object.assign(defaults.configOptions, options.configOptions);
	axe.configure(configOptions);

	const runOptions = Object.assign(defaults.runOptions, options.runOptions);
	return await axe.run(context, runOptions)
		.then((rules) => {

			axe.reset();

			
			let violations = [];
			rules.forEach(item => {

				item.violations.forEach( violation => {
					if(violation.result === 'failed'){
						violations.push({
							selector:violation.node.selector,
							ruleId: item.id
						});
					}
				});

			});

			violations.sort(function(a,b) {
				a = document.querySelector(a.selector);
				b = document.querySelector(b.selector);
				
				if( a === b) return 0;
				if( a.compareDocumentPosition(b) & 2) {
					// b comes before a
					return 1;
				}
				return -1;
			});
			
			return { rules, violations };
			
	
		}).catch((err) => {
			axe.reset();

			//TODO:
			return err;
		});


	
};
