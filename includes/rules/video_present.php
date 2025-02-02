<?php
/**
 * Accessibility Checker plugin file.
 *
 * @package Accessibility_Checker
 */

/**
 * Video Present Check
 *
 * @param array  $content Array of content to check.
 * @param object $post Object to check.
 * @return array
 */
function edac_rule_video_present( $content, $post ) {

	$dom = $content['html'];
	$file_extensions = array( '.3gp', '.asf', '.asx', '.avi', '.flv', '.m4p', '.mov', '.mp4', '.mpeg', '.mpeg2', '.mpg', '.mpv', '.ogg', '.ogv', '.qtl', '.smi', '.smil', '.wax', '.webm', '.wmv', '.wmp', '.wmx' );
	$keywords = array( 'youtube', 'youtu.be', 'vimeo' );
	$errors = array();
	$videos_found = array();

	// check for video blocks.
	$elements = $dom->find( '.is-type-video' );
	if ( $elements ) {
		foreach ( $elements as $element ) {
			$errors[] = $element->outertext;

			// Check for just one iframe.
			$iframe = $element->find( 'iframe', 0 );
			if ( $iframe ) {
				$videos_found[ $iframe->getAttribute( 'src' ) ] = true;
			}
		}
	}

	// check for iframe embeds.
	$elements = $dom->find( 'iframe' );
	if ( $elements ) {
		$file_extensions = array_merge( $file_extensions, $keywords );
		foreach ( $elements as $element ) {
			$src_text = $element->getAttribute( 'src' );

			// Skip if iframe src is already found in the video blocks.
			if ( isset( $videos_found[ $src_text ] ) ) {
				continue;
			}

			foreach ( $file_extensions as $file_extension ) {
				if ( strpos( strtolower( $src_text ), $file_extension ) ) {
					$errors[] = $element->outertext;
				}
			}
		}
	}

	// check for video file extensions.
	$elements = $dom->find( '[src]' );
	if ( $elements ) {
		foreach ( $elements as $element ) {
			$src_text = $element->getAttribute( 'src' );

			// Skip if iframe src is already found in the video blocks.
			if ( isset( $videos_found[ $src_text ] ) ) {
				continue;
			}

			foreach ( $file_extensions as $file_extension ) {
				if ( strpos( strtolower( $src_text ), $file_extension ) ) {
					$errors[] = $element->outertext;
				}
			}
		}
	}

	return $errors;
}
