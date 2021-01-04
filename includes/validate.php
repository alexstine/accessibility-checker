<?php

/**
 * Check if current post has been checked, if not check on page load
 *
 * @return void
 */
function edac_post_on_load()
{	
	global $pagenow, $typenow;
	if ($pagenow == 'post.php') {
		global $post;
		$checked = get_post_meta($post->ID, '_edac_post_checked', true);
		if ($checked == false) {
			edac_validate($post->ID, $post);
		}
	}
}

/**
 * Post on save
 *
 * @param int $post_ID
 * @param array $post
 * @param bool $update
 * @return void
 */
function edac_save_post($post_ID, $post, $update)
{
	// prevents first past of save_post due to meta boxes on post editor in gutenberg
	if (empty($_POST))
		return;

	// ignore revisions
	if (wp_is_post_revision($post_ID))
		return;

	// ignore autosaves
	if (wp_is_post_autosave($post_ID))
		return;

	// check if update
	if (!$update)
		return;

	// handle the case when the custom post is quick edited
	if (wp_verify_nonce($_POST['_inline_edit'], 'inlineeditnonce'))
		return;

	edac_validate($post_ID, $post);
}

/**
 * Validate
 *
 * @param int $post_ID
 * @param array $post
 * @return void
 */
function edac_validate($post_ID, $post)
{
	// check post type
	$post_types = get_option('edac_post_types');
	if (!in_array($post->post_type, $post_types))
		return;

	// remove error records if post no longer exists
	if (get_post_status($post_ID) == false) {
	}

	// check if user can edit post
	if (!current_user_can('edit_pages'))
		return;

	if(EDAC_DEBUG == true) edac_log('Post Saved: ' . $post_ID);

	// apply filters to content
	$content = edac_get_content($post);
	if ( ! $content ) {
		return;
	}
	// set record check flag on previous error records
	edac_remove_corrected_posts($post_ID, $post->post_type, $pre = 1);

	// check and validate content
	$rules = edac_register_rules();
	if(EDAC_DEBUG == true){
		$rule_performance_results = [];
		$all_rules_process_time = microtime(true);
	}
	if ($rules) {
		foreach ($rules as $rule) {
			
			if ($rule['slug']) {
				if(EDAC_DEBUG == true){
					$rule_process_time = microtime(true);
				}
				$errors = call_user_func('edac_rule_' . $rule['slug'], $content, $post);

				if ($errors && is_array($errors)) {
					foreach ($errors as $error) {
						edac_insert_rule_data($post, $rule['slug'], $rule['rule_type'], $object = $error);
					}
				}
				if(EDAC_DEBUG == true){
					$time_elapsed_secs = microtime(true) - $rule_process_time;
					$rule_performance_results[$rule['slug']] = $time_elapsed_secs;
				}
			}
		}
		if(EDAC_DEBUG == true){
			edac_log($rule_performance_results);
		}
	}
	if(EDAC_DEBUG == true){
		$time_elapsed_secs = microtime(true) - $all_rules_process_time;
		edac_log('rules validate time: '.$time_elapsed_secs);
	}

	// remove corrected records
	edac_remove_corrected_posts($post_ID, $post->post_type, $pre = 2);

	// set post meta checked
	add_post_meta($post_ID, '_edac_post_checked', true, true);
}

/**
 * Remove corrected posts
 *
 * @param int $post_ID
 * @param string $type
 * @param int $pre
 * @return void
 */
function edac_remove_corrected_posts($post_ID, $type, $pre = 1)
{
	global $wpdb;

	if ($pre == 1) {
		// set record flag before validating content	
		$wpdb->query($wpdb->prepare('UPDATE ' . $wpdb->prefix . 'accessibility_checker SET recordcheck = %d WHERE siteid = %d and postid = %d and type = %s', 0, get_current_blog_id(), $post_ID, $type));
	} elseif ($pre == 2) {
		// after validation is complete remove previous errors that were not found
		$wpdb->query($wpdb->prepare('DELETE FROM ' . $wpdb->prefix . 'accessibility_checker WHERE siteid = %d and postid = %d and type = %s and recordcheck = %d', get_current_blog_id(), $post_ID, $type, 0));
	}
}

/**
 * Get content
 *
 * @param  WP_Post $post
 * @return simple_html_dom | bool
 */
function edac_get_content($post)
{
	$content = false;
	$context = '';
	$username = get_option('edac_authorization_username');
	$password = get_option('edac_authorization_password');

	// set transient to get html from draft posts
	set_transient('edac_public_draft',true, 5 * MINUTE_IN_SECONDS);

	// http authorization
	if($username && $password){
		$context = stream_context_create(array(
			'http' => array(
				'header'  => "Authorization: Basic " . base64_encode("$username:$password")
			)
		));
	}
	try{
		if($context){
			$content = file_get_html(get_the_permalink($post->post_ID), false, $context);
		}else{
			$content = file_get_html(get_the_permalink($post->post_ID));
		}
	} catch (Exception $e){
		$content = false;
	}
	
	// done getting html, delete transient
	delete_transient('edac_public_draft');

	return $content;
}

/**
 * Set drafts post_status to publish momentarily while getting page html
 *
 * @param array $query
 * @return void
 */
function edac_show_draft_posts( $query ) {

    if ( is_admin() || is_feed() )
		return;
		
	if(get_transient('edac_public_draft') == false)
		return;
	
	$query->set( 'post_status', array( 'publish', 'draft', 'pending', 'auto-draft' ) );
}

add_action( 'pre_get_posts', 'edac_show_draft_posts' );