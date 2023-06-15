import 'axe-core';

//TODO: 			
//see: https://www.youtube.com/watch?v=AtsX0dPCG_4
//see: https://github.com/dequelabs/axe-core/blob/develop/doc/developer-guide.md#api-reference
//see: https://www.deque.com/axe/core-documentation/api-documentation/
	
export async function scan( options, includeIncompletes = false ) {

	
	const context = { exclude: ['#wpadminbar', '.edac-panel-container'] };
	
	const defaults = {
		runOnly: {
			type: 'tag',
			values: [
				'wcag2a', 'wcag2aa', 'wcag2aaa', 
				'wcag21a','wcag21aa', 'wcag22aa',
				'best-practice',
				'ACT',
				'section508',
				'TTv5',
				'experimental'
			]
		}
	};
	options = Object.assign(defaults, options);
	axe.configure( options );

	return await axe.run( context, options )
		.then((results) => {

			let list = {
				'violations' : results.violations
			};
	
			
			if(includeIncompletes){
				//these need manual review.
				list.incompletes = results.incomplete; 
			}			
			

			let issues = [];

			
			for (const [key, items] of Object.entries(list)) {
				items.forEach(item => {
					
					item.nodes.forEach(node => {
						const issue = {
							id: item.id,
							description: item.description,
							help: item.help,
							helpUrl: item.helpUrl,
							impact: node.impact,
							summary: node.failureSummary,
							selector: node.target,
							html: node.html,
							resultType: key
						};

						
						issues.push(issue);
					
	
					});
					
				});

			};
		
			return issues;
	
		}).catch((err) => {
			return err;
	});

	axe.reset();

};
