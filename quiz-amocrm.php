<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @since             1.0.0
 * @package           Quiz_Amocrm
 *
 * @wordpress-plugin
 * Plugin Name:       Quiz Amocrm
 * Plugin URI:        https://github.com/chuvacode/quiz-amocrm
 * Description:       Wordpress plugin for integration with amocrm.
 * Version:           1.0.0
 * Author:            Alexey Chuvakov
 * Author URI:        https://github.com/chuvacode
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       quiz-amocrm
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Update it as you release new versions.
 */
define( 'QUIZ_AMOCRM_VERSION', '1.0.0' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-quiz-amocrm-activator.php
 */
function activate_quiz_amocrm() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-quiz-amocrm-activator.php';
	Quiz_Amocrm_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-quiz-amocrm-deactivator.php
 */
function deactivate_quiz_amocrm() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-quiz-amocrm-deactivator.php';
	Quiz_Amocrm_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_quiz_amocrm' );
register_deactivation_hook( __FILE__, 'deactivate_quiz_amocrm' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-quiz-amocrm.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_quiz_amocrm() {

	$plugin = new Quiz_Amocrm();
	$plugin->run();

}
run_quiz_amocrm();
