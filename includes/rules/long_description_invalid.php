<?php
/**
 * Accessibility Checker pluign file.
 *
 * @package Accessibility_Checker
 */

/**
 * Log Description Invalid Check
 *
 * @param array  $content Array of content to check.
 * @param object $post Object to check.
 * @return array
 */
function edac_rule_long_description_invalid( $content, $post ) {

	$dom = $content['html'];
	$images = $dom->find( 'img' );
	$image_extensions = array( '.apng', '.bmp', '.gif', '.ico', '.cur', '.jpg', '.jpeg', '.jfif', '.pjpeg', '.pjp', '.png', '.svg', '.tif', '.tiff', '.webp' );
	$errors = array();

	if ( $images ) {
		foreach ( $images as $image ) {
			if ( $image->hasAttribute( 'longdesc' ) ) {

				$image_code = $image->outertext;
				$longdesc = $image->getAttribute( 'longdesc' );
				$file_parts = pathinfo( $longdesc );
				$valid_url = filter_var( $longdesc, FILTER_VALIDATE_URL );

				if ( $image->getAttribute( 'longdesc' ) == ''
				|| ! $valid_url
				|| ! $file_parts['extension']
				|| ! $file_parts['filename']
				|| in_array( '.' . $file_parts['extension'], $image_extensions )
				) {
					$errors[] = $image_code;
				}
			}
		}
	}
	return $errors;
}
